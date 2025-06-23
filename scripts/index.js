/**
 * WorkflowBuilder class to handle multi-step form functionality
 */
class WorkflowBuilder {
  constructor() {
    /** @type {HTMLFormElement} */
    this.form = document.forms.namedItem('workflowBuilder');
    /** @type {HTMLFieldSetElement[]} */
    this.steps = Array.from(this.form.querySelectorAll('.criteriaStep'));
    /** @type {HTMLButtonElement} */
    this.nextButton = this.form.querySelector('#nextButton');
    /** @type {HTMLButtonElement} */
    this.backButton = this.form.querySelector('#backButton');
    /** @type {HTMLButtonElement} */
    this.saveButton = this.form.querySelector('#saveButton');
    /** @type {HTMLButtonElement} */
    this.conditionalButton = this.form.querySelector('#conditionalButton');
    /** @type {NodeListOf<HTMLDivElement>} */
    this.progressSteps = this.form.querySelectorAll('.progress-step');
    /** @type {number} */
    this.currentStepIndex = 0;

    if (!this.form || !this.nextButton || !this.backButton || !this.saveButton) {
      console.error('Required form elements not found');
      return;
    }

    this.initializeForm();

    this.goToNextStep = this.goToNextStep.bind(this);
    this.goToPreviousStep = this.goToPreviousStep.bind(this);
    this.validateCurrentStep = this.validateCurrentStep.bind(this);
    this.updateSelectionClass = this.updateSelectionClass.bind(this);
    this.showConditionalButton = this.showConditionalButton.bind(this);

    this.setupEventListeners();
  }

  /**
   * 
   * @param {HTMLInputElement} checkbox 
   */
  updateSelectionClass(checkbox) {
    const container = checkbox.closest('.selection-card') || checkbox.closest('.select-all');
    if (container) {
      container.classList.toggle('selected', checkbox.checked);
    }
  }

  /**
   * Set up all event listeners for form navigation and validation
   */
  setupEventListeners() {
    if (this.nextButton && this.backButton) {
      this.nextButton.addEventListener('click', this.goToNextStep);
      this.backButton.addEventListener('click', this.goToPreviousStep);
    }

    if (this.steps && this.steps.length > 0) {
      this.steps.forEach(step => {
        /** @type {NodeListOf<HTMLInputElement>} */
        const checkboxes = step.querySelectorAll('input[type="checkbox"]');
      
        checkboxes.forEach(checkbox => {
          checkbox.addEventListener('change', () => {
            this.validateCurrentStep();
            this.updateSelectionClass(checkbox);
            this.showConditionalButton();
          });
      
          this.updateSelectionClass(checkbox);
        });
      });
    }

    /** @type {HTMLInputElement} */
    const selectAllCheckbox = this.form.elements['selectAllRecordTypes'];
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', () => {
        /** @type {NodeListOf<HTMLInputElement>} */
        const recordTypeCheckboxes = this.form.elements['recordType'];
        Array.from(recordTypeCheckboxes).forEach(checkbox => {
          checkbox.checked = selectAllCheckbox.checked;
          // update parent with selected class
          const container = checkbox.closest('.selection-card');
          if (container) {
            if (selectAllCheckbox.checked) {
              container.classList.add('selected');
            } else {
              container.classList.remove('selected');
            }
          }
        });
        this.validateCurrentStep();
      });

      /** @type {NodeListOf<HTMLInputElement>} */
      const recordTypeCheckboxes = this.form.elements['recordType'];
      Array.from(recordTypeCheckboxes).forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const allChecked = Array.from(recordTypeCheckboxes).every(cb => cb.checked);
          selectAllCheckbox.checked = allChecked;
        });
      });
    }
  }

  showConditionalButton() {
    const hasTriggerSelected = Array
    .from(this.form.querySelectorAll('input[name="trigger"]'))
    .some(cb => cb.checked);
    if (this.currentStepIndex === 2 && hasTriggerSelected) {
      this.conditionalButton.classList.remove('hidden');
    } else {
      this.conditionalButton.classList.add('hidden');
    }
  }

  /**
   * Initialize the form state by setting up initial visibility and validation
   */
  initializeForm() {
    // Hide all steps except the first one
    this.steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.remove('hidden');
        step.setAttribute('aria-hidden', 'false');
      } else {
        step.classList.add('hidden');
        step.setAttribute('aria-hidden', 'true');
      }
    });

    this.updateProgressIndicator();

    this.backButton.classList.add('hidden');
    this.nextButton.disabled = true;
    this.saveButton.classList.add('hidden');
    this.validateCurrentStep();
  }

  /**
   * Validate the current step by checking if at least one checkbox is selected
   * @returns {boolean} - Whether the current step is valid
   */
  validateCurrentStep() {
    return this.validateStep(this.currentStepIndex);
  }

  /**
   * Validate a specific step by checking if at least one checkbox is selected
   * @param {number} stepIndex - The index of the step to validate
   * @returns {boolean} - Whether the step is valid
   */
  validateStep(stepIndex) {
    const step = this.steps[stepIndex];
    if (!step) return false;

    /** @type {NodeListOf<HTMLInputElement>} */
    const checkboxes = step.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length === 0) return true; // If no checkboxes, consider valid

    const isValid = Array.from(checkboxes).some(checkbox => checkbox.checked);

    // Only update the next button if this is the current step
    if (stepIndex === this.currentStepIndex) {
      this.nextButton.disabled = !isValid;
    }

    return isValid;
  }

  /**
   * Go to the next step in the form
   */
  goToNextStep() {
    if (this.currentStepIndex < this.steps.length - 1 && this.validateCurrentStep()) {
      // Hide current step
      this.steps[this.currentStepIndex].classList.add('hidden');
      this.steps[this.currentStepIndex].setAttribute('aria-hidden', 'true');

      // Show next step
      this.currentStepIndex++;
      this.steps[this.currentStepIndex].classList.remove('hidden');
      this.steps[this.currentStepIndex].setAttribute('aria-hidden', 'false');

      this.updateProgressIndicator();
      this.updateNavigationButtons();

      // If we're on the review step, update the summary
      if (this.currentStepIndex === this.steps.length - 1) {
        this.updateReviewSummary();
      }

      this.form.scrollIntoView({ behavior: 'smooth' });

      this.validateCurrentStep();
    }
  }

  /**
   * Go to the previous step in the form
   */
  goToPreviousStep() {
    if (this.currentStepIndex > 0) {
      // Hide current step
      this.steps[this.currentStepIndex].classList.add('hidden');
      this.steps[this.currentStepIndex].setAttribute('aria-hidden', 'true');

      // Show previous step
      this.currentStepIndex--;
      this.steps[this.currentStepIndex].classList.remove('hidden');
      this.steps[this.currentStepIndex].setAttribute('aria-hidden', 'false');

      this.updateProgressIndicator();
      this.updateNavigationButtons();

      this.form.scrollIntoView({ behavior: 'smooth' });

      this.validateCurrentStep();
    }
  }

  /**
   * Update the progress indicator to reflect current step and completed steps
   */
  updateProgressIndicator() {
    if (!this.progressSteps) {
      return;
    }

    /**
     * Map fieldset indices to progress step indices
     * We have 5 fieldsets but only 4 nav links
     * @param {number} fieldsetIndex
     * @returns {number}
     */
    const getProgressStepIndex = (fieldsetIndex) => {
      if (fieldsetIndex === 0 || fieldsetIndex === 1) {
        return 0; // First two fieldsets map to first nav link
      } else {
        return fieldsetIndex - 1; // Other fieldsets map to nav links offset by 1
      }
    };

    /**
     * Map progress step indices to fieldset indices
     * @param {number} progressStepIndex
     * @returns {number}
     */
    const getFieldsetIndex = (progressStepIndex) => {
      if (progressStepIndex === 0) {
        return 0; // First nav link maps to first fieldset
      } else {
        return progressStepIndex + 1; // Other nav links map to fieldsets offset by 1
      }
    };

    /**
     * Update progress steps
     */
    this.progressSteps.forEach((step, progressStepIndex) => {
      const stepLink = step.querySelector('a');
      const currentProgressStepIndex = getProgressStepIndex(this.currentStepIndex);

      // Check if this step should be enabled based on validation
      const shouldBeEnabled = progressStepIndex <= currentProgressStepIndex;

      // Special case: Second nav link (Trigger) should only be enabled if both first and second fieldsets are valid
      const isSecondNavLink = progressStepIndex === 1;
      const firstStepValid = this.validateStep(0);
      const secondStepValid = this.validateStep(1);

      // For the second nav link, we need both first and second steps to be valid
      const secondNavLinkEnabled = isSecondNavLink ? (firstStepValid && secondStepValid) : true;

      // Determine if this nav link should be enabled
      const isEnabled = shouldBeEnabled && secondNavLinkEnabled;

      if (progressStepIndex < currentProgressStepIndex) {
        // Completed steps
        step.classList.add('completed');
        step.classList.remove('active');
        step.setAttribute('aria-selected', 'false');

        // Enable link for completed steps
        if (stepLink) {
          stepLink.classList.remove('disabled');
          stepLink.setAttribute('tabindex', '0');
          stepLink.addEventListener('click', (e) => this.handleStepLinkClick(e, getFieldsetIndex(progressStepIndex)));
        }
      } else if (progressStepIndex === currentProgressStepIndex) {
        // Current step
        step.classList.add('active');
        step.classList.remove('completed');
        step.setAttribute('aria-selected', 'true');

        // Enable link for current step
        if (stepLink) {
          stepLink.classList.remove('disabled');
          stepLink.setAttribute('tabindex', '0');
          stepLink.addEventListener('click', (e) => this.handleStepLinkClick(e, getFieldsetIndex(progressStepIndex)));
        }
      } else {
        // Future steps
        step.classList.remove('active', 'completed');
        step.setAttribute('aria-selected', 'false');

        // Disable link for future steps
        if (stepLink) {
          stepLink.classList.add('disabled');
          stepLink.setAttribute('tabindex', '-1');

          // Remove previous event listeners and add a new one that prevents navigation
          stepLink.addEventListener('click', (e) => {
            e.preventDefault();
            return false;
          });
        }
      }
    });
  }

  /**
   * Handle click on step links in the progress indicator
   * @param {Event} e - The click event
   * @param {number} stepIndex - The index of the step to navigate to
   */
  handleStepLinkClick(e, stepIndex) {
    e.preventDefault();

    // Only allow navigation to completed steps or the current step
    if (stepIndex <= this.currentStepIndex) {
      // Hide current step
      this.steps[this.currentStepIndex].classList.add('hidden');
      this.steps[this.currentStepIndex].setAttribute('aria-hidden', 'true');

      // Show target step
      this.currentStepIndex = stepIndex;
      this.steps[stepIndex].classList.remove('hidden');
      this.steps[stepIndex].setAttribute('aria-hidden', 'false');

      // Update UI
      this.updateProgressIndicator();
      this.updateNavigationButtons();

      // Scroll to top of the form
      this.form.scrollIntoView({ behavior: 'smooth' });

      // Validate the new step
      this.validateCurrentStep();

      // If we're on the review step, update the summary
      if (this.currentStepIndex === this.steps.length - 1) {
        this.updateReviewSummary();
      }
    }

    return false;
  }

  /**
   * Update navigation buttons visibility based on current step
   */
  updateNavigationButtons() {
    if (this.currentStepIndex === 0) {
      this.backButton.classList.add('hidden');
    } else {
      this.backButton.classList.remove('hidden');
    }

    if (this.currentStepIndex > 1) {
      this.saveButton.classList.remove('hidden');
    } else {
      this.saveButton.classList.add('hidden');
    }

    if (this.currentStepIndex === this.steps.length - 1) {
      this.nextButton.textContent = 'Save Draft';
    } else {
      this.nextButton.textContent = 'Next';
    }
  }

  /**
   * Format a list of items into natural language with commas and a conjunction.
   * @param {string[]} items
   * @param {string} conjunction - 'and' or 'or'
   * @returns {string}
   */
  formatList(items, conjunction = 'and') {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
    const allButLast = items.slice(0, -1).join(', ');
    const last = items[items.length - 1];
    return `${allButLast}, ${conjunction} ${last}`;
  }

  /**
   * Updates the review summary section with the user's selections
   */
  updateReviewSummary() {
    /** @type {HTMLDivElement} */
    const reviewContent = this.form.querySelector('#reviewContent');
    if (!reviewContent) return;

    // Clear previous content
    reviewContent.innerHTML = '';

    // Get selected record types
    const selectedRecordTypes = Array.from(this.form.elements['recordType'])
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    // Get selected triggers
    const selectedTriggers = Array.from(this.form.elements['trigger'])
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    // Get selected actions
    const selectedActions = Array.from(this.form.elements['action'])
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    // Create summary elements
    if (selectedRecordTypes.length > 0 && selectedTriggers.length > 0 && selectedActions.length > 0) {
      const triggerText = this.formatList(selectedTriggers, 'or');
      const actionText = this.formatList(selectedActions, 'and');
      const summaryParagraph = document.createElement('p');
      summaryParagraph.textContent = `When any of the following record types is ${triggerText}, ${actionText}.`;
      reviewContent.appendChild(summaryParagraph);

      const recordTypeList = document.createElement('ul');
      selectedRecordTypes.forEach(recordType => {
        const listItem = document.createElement('li');
        listItem.textContent = recordType;
        recordTypeList.appendChild(listItem);
      });

      reviewContent.appendChild(recordTypeList);
    } else {
      // If any selection is missing, show an error message
      const errorMessage = document.createElement('p');
      errorMessage.textContent = 'Please complete all previous steps before reviewing.';
      errorMessage.classList.add('error-message');
      reviewContent.appendChild(errorMessage);
    }
  }
}

// Initialize the workflow builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  new WorkflowBuilder();
});
