import { dom } from "./dom.js";
import { project } from "./state.js";
import { saveProject } from "./storage.js";
import { downloadFile, escapeHtml } from "./utils.js";
import { renderSubtitleList } from "./ui_subtitles.js";
import { updateWordCounter } from "./ui_preview.js";
import { clearEditor } from "./ui_editor.js";
import { showToast } from "./ui_toast.js";

function handleProjectImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (
        !data ||
        !Array.isArray(data.subtitles) ||
        !Array.isArray(data.words)
      ) {
        throw new Error("Invalid project file format.");
      }
      Object.assign(project, data);
      clearEditor();
      saveProject();
      renderSubtitleList();
      updateWordCounter();
      dom.editorPlaceholder.innerHTML = `${ICONS.pointer}<p>Click a word to start.</p>`;
      showToast(`Project "${project.subtitleFile}" loaded successfully.`);
    } catch (error) {
      showToast(`Error importing project: ${error.message}`, "error");
      console.error(error);
    }
  };
  reader.readAsText(file);
}

function triggerProjectImport() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.onchange = handleProjectImport;
  fileInput.click();
}

function handleProjectSave() {
  if (project.subtitles.length === 0) {
    showToast("Nothing to save. Please import subtitles first.", "error");
    return;
  }
  const filename = `subtly-project-${project.subtitleFile.replace(
    /\.(srt|vtt)$/,
    ""
  )}.json`;
  const content = JSON.stringify(project, null, 2);
  downloadFile(filename, content, "application/json");
}

function escapeCsvCell(cell) {
  const cellStr = String(cell == null ? "" : cell);
  if (
    cellStr.includes(",") ||
    cellStr.includes('"') ||
    cellStr.includes("\n")
  ) {
    return `"${cellStr.replace(/"/g, '""')}"`;
  }
  return cellStr;
}

function exportToCsv() {
  if (project.words.length === 0) {
    showToast("No words to export.", "error");
    return;
  }
  const headers = ["Word", "Sentence", "Meaning", "Note"];
  const rows = project.words.map((word) => [
    word.word,
    word.sentence,
    word.meaning,
    word.note,
  ]);
  let csvContent = headers.map(escapeCsvCell).join(",") + "\n";
  csvContent += rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  downloadFile("subtly-words.csv", csvContent, "text/csv;charset=utf-8;");
}

function exportToDoc() {
  if (project.words.length === 0) {
    showToast("No words to export.", "error");
    return;
  }
  let htmlContent = `<html><head><meta charset="utf-8"><title>Subtly Export</title></head><body>`;
  project.words.forEach((word) => {
    htmlContent += `<div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">`;
    htmlContent += `<h2 style="margin: 0 0 5px 0;">${escapeHtml(
      word.word
    )}</h2>`;
    htmlContent += `<p style="margin: 0 0 5px 0;"><strong>Sentence:</strong> <em>${escapeHtml(
      word.sentence
    )}</em></p>`;
    htmlContent += `<p style="margin: 0 0 5px 0;"><strong>Meaning:</strong> ${escapeHtml(
      word.meaning
    )}</p>`;
    htmlContent += `<div><strong>Note:</strong> ${escapeHtml(word.note)}</div>`;
    htmlContent += `</div>`;
  });
  htmlContent += `</body></html>`;
  downloadFile("subtly-words.doc", htmlContent, "application/msword");
}

export function initFileControls() {
  dom.importJsonBtn.addEventListener("click", triggerProjectImport);
  dom.saveJsonBtn.addEventListener("click", handleProjectSave);
  dom.exportCsvBtn.addEventListener("click", exportToCsv);
  dom.exportDocBtn.addEventListener("click", exportToDoc);
}
