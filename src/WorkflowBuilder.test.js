import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WorkflowBuilder } from './index.js';

/**
 * Sets up a minimal DOM structure that WorkflowBuilder expects.
 */
function setupDom() {
  document.body.innerHTML = `
    <form name="workflowBuilder">
      <button id="nextButton"></button>
      <button id="backButton"></button>
      <button id="saveButton"></button>

      <fieldset class="criteriaStep">
        <div class="selection-card">
          <input type="checkbox" name="recordType" value="TypeA" />
        </div>
        <div class="selection-card">
          <input type="checkbox" name="recordType" value="TypeB" />
        </div>
      </fieldset>
      <fieldset class="criteriaStep hidden" aria-hidden="true"></fieldset>
    </form>
  `;
}

describe('WorkflowBuilder helpers', () => {
  let builder;

beforeEach(() => {
    setupDom();
    builder = new WorkflowBuilder();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('formatList handles single item', () => {
    expect(builder.formatList(['Apple'], 'and')).toBe('Apple');
  });

  it('formatList handles two items with custom conjunction', () => {
    expect(builder.formatList(['Apple', 'Orange'], 'or')).toBe('Apple or Orange');
  });

  it('formatList handles three or more items', () => {
    expect(builder.formatList(['A', 'B', 'C'], 'and')).toBe('A, B, and C');
  });

  it('validateCurrentStep returns false when no selection, true after selection', () => {
    const checkbox = document.querySelector('input[name="recordType"]');
    expect(builder.validateCurrentStep()).toBe(false);
    checkbox.checked = true;
    expect(builder.validateCurrentStep()).toBe(true);
  });

  it('updateNavigationButtons hides back button on first step and shows later', () => {
    const backBtn = document.querySelector('#backButton');
    builder.updateNavigationButtons();
    expect(backBtn.classList.contains('hidden')).toBe(true);

    builder.currentStepIndex = 1;
    builder.updateNavigationButtons();
    expect(backBtn.classList.contains('hidden')).toBe(false);
  });

  it('updateSelectionClass toggles .selected on container', () => {
    const container = document.querySelector('.selection-card');
    const checkbox = container.querySelector('input');
    expect(container.classList.contains('selected')).toBe(false);
    checkbox.checked = true;
    builder.updateSelectionClass(checkbox);
    expect(container.classList.contains('selected')).toBe(true);
  });
});
