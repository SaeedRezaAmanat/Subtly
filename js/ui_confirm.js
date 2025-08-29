import { dom } from "./dom.js";

let resolveConfirmation;

/**
 * Shows a custom confirmation modal and returns a Promise that resolves
 * with true (confirmed) or false (cancelled).
 * @param {string} message The message to display in the confirmation dialog.
 * @returns {Promise<boolean>}
 */
export function showConfirmation(message) {
  // Set the message
  dom.confirmMessage.textContent = message;

  // Show the modal
  dom.confirmModal.style.display = "flex";

  // Return a new Promise that will be resolved by the button clicks
  return new Promise((resolve) => {
    resolveConfirmation = resolve; // Store the resolve function so our listeners can access it
  });
}

function handleConfirm() {
  dom.confirmModal.style.display = "none";
  if (resolveConfirmation) {
    resolveConfirmation(true);
  }
}

function handleCancel() {
  dom.confirmModal.style.display = "none";
  if (resolveConfirmation) {
    resolveConfirmation(false);
  }
}

/**
 * Initializes the event listeners for the confirmation modal buttons.
 * This only needs to run once.
 */
export function initConfirmControls() {
  dom.confirmBtn.addEventListener("click", handleConfirm);
  dom.cancelBtn.addEventListener("click", handleCancel);
  // Also allow closing by clicking the backdrop
  dom.confirmModal.addEventListener("click", (e) => {
    if (e.target === dom.confirmModal) {
      handleCancel();
    }
  });
}
