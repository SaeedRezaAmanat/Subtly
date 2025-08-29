import { dom } from "./dom.js";
import { loadProject } from "./storage.js";
import { initSubtitleControls, renderSubtitleList } from "./ui_subtitles.js";
import { initEditorControls, updateEditorPlaceholder } from "./ui_editor.js"; // <-- Import the new function
import { initPreviewControls, updateWordCounter } from "./ui_preview.js";
import { initHelpControls } from "./ui_help.js";
import { initShortcuts } from "./ui_shortcuts.js";
import { initFileControls } from "./file_handler.js";
import { initTheme } from "./ui_theme.js";
import { initIcons } from "./ui_icons.js";
import { initConfirmControls } from "./ui_confirm.js";

function bindAppEvents() {
  document.addEventListener("wordSaved", () => {
    renderSubtitleList();
    updateWordCounter();
  });
}

function main() {
  initTheme();
  initIcons();
  loadProject();
  initSubtitleControls();
  initEditorControls();
  initPreviewControls();
  initHelpControls();
  initFileControls();
  initConfirmControls();
  initShortcuts();
  bindAppEvents();
  renderSubtitleList();
  updateWordCounter();
  updateEditorPlaceholder(); // <-- CALL the function here
}

document.addEventListener("DOMContentLoaded", main);
