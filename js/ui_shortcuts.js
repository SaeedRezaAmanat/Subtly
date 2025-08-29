import { dom } from "./dom.js";
import { clearEditor } from "./ui_editor.js";

export function initShortcuts() {
  document.addEventListener("keydown", (e) => {
    const isModalOpen =
      dom.previewModal.style.display === "flex" ||
      dom.helpModal.style.display === "flex";

    // Esc key
    if (e.key === "Escape") {
      if (isModalOpen) {
        dom.previewModal.style.display = "none";
        dom.helpModal.style.display = "none";
      } else {
        clearEditor();
      }
    }

    // Do not trigger other shortcuts if an input is focused
    if (e.target.matches("input, textarea")) return;

    // Ctrl/Cmd + S to save word
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      dom.saveWordBtn.click();
    }

    // Ctrl/Cmd + E to open preview
    if ((e.ctrlKey || e.metaKey) && e.key === "e") {
      e.preventDefault();
      dom.openPreviewBtn.click();
    }
  });
}
