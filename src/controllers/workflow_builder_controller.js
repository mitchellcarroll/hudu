import { Controller } from "@hotwired/stimulus";


export default class extends Controller {

  static targets = [
    "step", // Each <fieldset> on the page
    "progressStep", // Nav indicator elements
    "next", // "Next / Save Draft" button (footer)
    "back", // "Back" button (footer)
    "save", // "Save & finish later" button (footer)
    "review", // Container that holds the generated workflow summary
    "conditionalButton" // "Add Condition" button (trigger step)
  ];

  /** @type {number} */
  currentStepIndex = 0;

  /** Called once when the controller is connected to the DOM */
  connect() {
    // Ensure we start at page 0 if the attribute is missing
    if (isNaN(this.currentStepIndex)) {
      this.currentStepIndex = 0;
    }

    this.showCurrentStep();
    this.validate();
  }

  /* ------------------------------------------------------------------
   * Data actions
   * ------------------------------------------------------------------*/

  /**
   * Checkbox change handler toggles selected class on its card and re-validates.
   * Bound in markup via `data-action="change->workflow-builder#toggle"`.
   */
  toggle(event) {
    const cb = event.target;
    const card = cb.closest(".selection-card, .select-all");
    if (card != null) {
      card.classList.toggle("selected", cb.checked);
    }
    // Handle select-all logic (Criteria step) automatically keep other checkboxes in sync
    if (cb.name === "selectAllRecordTypes") {
      const boxes = this.element.querySelectorAll("input[name='recordType']");
      boxes.forEach(b => {
        b.checked = cb.checked;
        b.closest('.selection-card')?.classList.toggle('selected', b.checked);
      });
    }

    // Show/hide "Add Condition" button based on checkbox state in Trigger Step
    if (this.currentStepIndex === 2) {
      const anyChecked = Array.from(this.currentStepTarget.querySelectorAll("input[type=checkbox]"))
        .some(box => box.checked);
      this.conditionalButtonTarget.classList.toggle("hidden", !anyChecked);
    } else {
      this.conditionalButtonTarget.classList.add("hidden");
    }

    this.validate();
  }

  /**
   * Handle click on the "Next / Save Draft" button.
   */
  next() {
    // Prevent advancing if current step fails validation
    if (!this.validate()) return;

    if (this.isReviewStep) {
      // Submit or "save draft" logic would live here.
      // For now we simply bail out.
      return;
    }

    this.currentStepIndex++;
    this.showCurrentStep();
    this.validate();
  }

  /** Handle click on the "Back" button */
  previous() {
    if (this.currentStepIndex === 0) return;

    this.currentStepIndex--;
    this.showCurrentStep();
    this.validate();
  }

  /**
   * Handle click on a progress-indicator step.
   * Only allows navigating to already-completed steps.
   */
  goToStep(event) {
    const navIdx = this.progressStepTargets.indexOf(event.currentTarget);
    const targetStep = navIdx === 0 ? 0 : navIdx + 1;

    if (targetStep <= this.currentStepIndex) {
      this.currentStepIndex = targetStep;
      this.showCurrentStep();
      this.validate();
    }
  }

  /**
   * Re-run validation for the current step and update UI accordingly.
   * Returns `true` if the step is valid.
   */
  validate() {
    const checkboxes = this.currentStepTarget.querySelectorAll("input[type=checkbox]");
    const valid = Array.from(checkboxes).some(cb => cb.checked);

    this.nextTarget.disabled = !valid;
    this.saveTarget.classList.toggle("hidden", this.currentStepIndex <= 1);

    if (this.isReviewStep) this.updateReviewSummary();

    return valid;
  }

  /* ------------------------------------------------------------------
   * Private helpers
   * ------------------------------------------------------------------*/

  /**
   * Update *all* pieces of UI so they reflect `currentStepIndex`.
   */
  showCurrentStep() {
    this.stepTargets.forEach((step, i) => {
      const active = i === this.currentStepIndex;
      step.hidden = !active;
      step.classList.toggle("hidden", !active);
      step.setAttribute("aria-hidden", (!active).toString());
    });
    const progressIdx = this.currentStepIndex <= 1 ? 0 : this.currentStepIndex - 1;
    this.progressStepTargets.forEach((nav, i) => {
      const link = nav.querySelector('a');
      const isCurrent   = i === progressIdx;
      const isComplete  = i <  progressIdx;
      nav.classList.toggle('active',  isCurrent);
      nav.classList.toggle('completed', isComplete);

      if (link) {
        const disabled = !isComplete && !isCurrent;
        link.classList.toggle('disabled', disabled);
        link.tabIndex = disabled ? -1 : 0;
      }
    });
    this.backTarget.classList.toggle("hidden", this.currentStepIndex === 0);
    this.nextTarget.textContent = this.isReviewStep ? "Save Draft" : "Next";
  }

  /**
   * Builds the human-readable summary shown on the review step.
   */
  updateReviewSummary() {
    // Clear any existing content
    this.reviewTarget.innerHTML = "";

    // Collect checked values by input name
    const selected = name => [
      ...this.element.querySelectorAll(`input[name='${name}']:checked`)
    ].map(cb => cb.value);

    const recordTypes = selected("recordType");
    const triggers    = selected("trigger");
    const actions     = selected("action");

    if (recordTypes.length && triggers.length && actions.length) {
      const formatList = (arr, conj = "and") => {
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return `${arr[0]} ${conj} ${arr[1]}`;
        return `${arr.slice(0, -1).join(", ")}, ${conj} ${arr[arr.length - 1]}`;
      };

      const triggerText = formatList(triggers, "or");
      const actionText  = formatList(actions, "and");

      const p = document.createElement("p");
      p.textContent = `When any of the following record types is ${triggerText}, ${actionText}.`;
      this.reviewTarget.appendChild(p);

      const ul = document.createElement("ul");
      recordTypes.forEach(rt => {
        const li = document.createElement("li");
        li.textContent = rt;
        ul.appendChild(li);
      });
      this.reviewTarget.appendChild(ul);
    } else {
      // User should never get here, but just in case
      const err = document.createElement("p");
      err.className = "error-message";
      err.textContent = "Please complete all previous steps before reviewing.";
      this.reviewTarget.appendChild(err);
    }
  }

  get isReviewStep() {
    return this.currentStepIndex === this.stepTargets.length - 1;
  }

  get currentStepTarget() {
    return this.stepTargets[this.currentStepIndex];
  }
}
