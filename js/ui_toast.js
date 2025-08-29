import { dom } from "./dom.js";

let toastTimeout;

/**
 * Displays a toast notification.
 * @param {string} message The message to display.
 * @param {string} type 'success' (default) or 'error'.
 */
export function showToast(message, type = "success") {
  if (!dom.toastNotification) return;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  dom.toastNotification.textContent = message;
  dom.toastNotification.className = `toast is-${type}`; // Use classes for styling

  // Force reflow to restart animation
  dom.toastNotification.offsetHeight;

  dom.toastNotification.classList.add("is-visible");

  toastTimeout = setTimeout(() => {
    dom.toastNotification.classList.remove("is-visible");
  }, 3000);
}
