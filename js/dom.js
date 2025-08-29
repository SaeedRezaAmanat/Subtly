// This module queries the DOM once and exports all element references.
// This is more efficient than querying the DOM multiple times in different modules.

export const dom = {
  // Main App & Toggles
  html: document.documentElement,
  themeToggleBtn: document.getElementById("themeToggleBtn"),

  // Top Controls
  importSrtBtn: document.getElementById("importSrtBtn"),
  importJsonBtn: document.getElementById("importJsonBtn"),
  searchInput: document.getElementById("searchInput"),
  searchClearBtn: document.getElementById("searchClearBtn"),

  // Left Panel
  subtitleList: document.getElementById("subtitleList"),
  subtitleFilename: document.getElementById("subtitleFilename"),
  subtitleRowTemplate: document.getElementById("subtitleRowTemplate"),

  // Right Panel (Editor)
  editorPanel: document.getElementById("editorPanel"),
  editorPlaceholder: document.getElementById("editorPlaceholder"),
  wordInput: document.getElementById("wordInput"),
  sentenceInput: document.getElementById("sentenceInput"),
  meaningInput: document.getElementById("meaningInput"),
  noteInput: document.getElementById("noteInput"),
  saveWordBtn: document.getElementById("saveWordBtn"),
  clearEditorBtn: document.getElementById("clearEditorBtn"),
  timestampDisplay: document.getElementById("timestampDisplay"),

  // Bottom Bar
  saveJsonBtn: document.getElementById("saveJsonBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  exportDocBtn: document.getElementById("exportDocBtn"),
  wordCounter: document.getElementById("wordCounter"),

  // Modals & Notifications
  previewModal: document.getElementById("previewModal"),
  openPreviewBtn: document.getElementById("openPreviewBtn"),
  closePreviewBtn: document.getElementById("closePreviewBtn"),
  previewList: document.getElementById("previewList"),
  sortTimeBtn: document.getElementById("sortTimeBtn"),
  sortAlphaBtn: document.getElementById("sortAlphaBtn"),
  helpModal: document.getElementById("helpModal"),
  openHelpBtn: document.getElementById("openHelpBtn"),
  closeHelpBtn: document.getElementById("closeHelpBtn"),
  toastNotification: document.getElementById("toastNotification"),
  confirmModal: document.getElementById("confirmModal"),
  confirmMessage: document.getElementById("confirmMessage"),
  confirmBtn: document.getElementById("confirmBtn"),
  cancelBtn: document.getElementById("cancelBtn"),
};
