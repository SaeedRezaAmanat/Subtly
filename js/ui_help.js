import { dom } from "./dom.js";

function openModal() {
  dom.helpModal.style.display = "flex";
}

function closeModal() {
  dom.helpModal.style.display = "none";
}

export function initHelpControls() {
  dom.openHelpBtn.addEventListener("click", openModal);
  dom.closeHelpBtn.addEventListener("click", closeModal);
  dom.helpModal.addEventListener("click", (e) => {
    if (e.target === dom.helpModal) closeModal();
  });
}
