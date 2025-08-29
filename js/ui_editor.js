import { dom } from "./dom.js";
import { ICONS } from "./icons.js"; // <-- Import ICONS here
import { project, selection } from "./state.js";
import { saveProject } from "./storage.js";
import { uid } from "./utils.js";
import { showToast } from "./ui_toast.js";

/**
 * Updates the placeholder message in the editor based on whether subtitles are loaded.
 */
export function updateEditorPlaceholder() {
  if (project.subtitles.length > 0) {
    dom.editorPlaceholder.innerHTML = `${ICONS.pointer}<p>Click a word to start.</p>`;
  } else {
    dom.editorPlaceholder.innerHTML = `${ICONS.upload}<p>Import a subtitle file to get started.</p>`;
  }
}

export function updateEditorState() {
  dom.editorPanel.classList.toggle(
    "is-blank",
    selection.selectedSubtitleIds.size === 0 && !selection.editingWordId
  );
}

export function showEditor() {
  dom.editorPanel.classList.remove("is-blank");
}

export function updateEditorSentence() {
  const selectedParts = Array.from(selection.selectedSubtitleIds)
    .map((id) => project.subtitles.find((p) => p.id === id))
    .filter(Boolean);
  dom.sentenceInput.value = selectedParts.map((p) => p.text).join(" ");
  dom.timestampDisplay.textContent =
    selectedParts.length > 0 ? `Timestamp: ${selectedParts[0].start}` : "";
}

export function setEditorWord(word) {
  dom.wordInput.value = word;
  dom.meaningInput.focus();
}

export function loadWordForEdit(wordId) {
  const word = project.words.find((w) => w.id === wordId);
  if (!word) return;

  selection.editingWordId = word.id;
  selection.selectedSubtitleIds = new Set(word.subtitlePartIds);
  dom.wordInput.value = word.word;
  dom.sentenceInput.value = word.sentence;
  dom.meaningInput.value = word.meaning;
  dom.noteInput.value = word.note || "";
  dom.saveWordBtn.textContent = "Update Word";

  updateEditorState();

  dom.subtitleList.querySelectorAll(".sub-checkbox").forEach((cb) => {
    const row = cb.closest(".sub-row");
    const partId = row.dataset.partId;
    cb.checked = selection.selectedSubtitleIds.has(partId);
    row.classList.toggle("is-selected", cb.checked);
  });
}

export function clearEditor() {
  selection.editingWordId = null;
  selection.selectedSubtitleIds.clear();
  dom.wordInput.value = "";
  dom.sentenceInput.value = "";
  dom.meaningInput.value = "";
  dom.noteInput.value = "";
  dom.timestampDisplay.textContent = "";
  dom.saveWordBtn.textContent = "Save Word";

  dom.subtitleList.querySelectorAll(".sub-checkbox:checked").forEach((cb) => {
    cb.checked = false;
    cb.closest(".sub-row").classList.remove("is-selected");
  });

  updateEditorState();
}

function saveWord() {
  const word = dom.wordInput.value.trim();
  if (!word) {
    showToast("Please provide a word to save.", "error");
    return;
  }
  const wordData = {
    word,
    sentence: dom.sentenceInput.value.trim(),
    meaning: dom.meaningInput.value.trim(),
    note: dom.noteInput.value.trim(),
    subtitlePartIds: Array.from(selection.selectedSubtitleIds),
    timestamp: dom.timestampDisplay.textContent.replace("Timestamp: ", ""),
  };
  if (selection.editingWordId) {
    const existingWord = project.words.find(
      (w) => w.id === selection.editingWordId
    );
    Object.assign(existingWord, wordData);
    showToast("Word updated successfully.");
  } else {
    wordData.id = uid("w");
    project.words.push(wordData);
    showToast("Word saved successfully.");
  }
  saveProject();
  document.dispatchEvent(new CustomEvent("wordSaved"));
  clearEditor();
}

export function initEditorControls() {
  dom.saveWordBtn.addEventListener("click", saveWord);
  dom.clearEditorBtn.addEventListener("click", clearEditor);
}
