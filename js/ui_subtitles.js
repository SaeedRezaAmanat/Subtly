import { dom } from "./dom.js";
import { project, selection } from "./state.js";
import { parseSubtitleContent } from "./parser.js";
import {
  updateEditorSentence,
  setEditorWord,
  showEditor,
  clearEditor,
} from "./ui_editor.js";
import { updateWordCounter } from "./ui_preview.js";

function buildHighlightedText(text, savedPhrasesForThisLine) {
  const wordRegex = /([a-zA-Z0-9'-]+)/g;
  const initialHtml = text.replace(
    wordRegex,
    '<span class="sub-word">$1</span>'
  );
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = initialHtml;
  const wordSpans = Array.from(tempDiv.querySelectorAll(".sub-word"));
  if (savedPhrasesForThisLine.length > 0) {
    savedPhrasesForThisLine.forEach((phrase) => {
      const phraseWords = phrase.toLowerCase().split(" ");
      for (let i = 0; i <= wordSpans.length - phraseWords.length; i++) {
        const potentialMatch = wordSpans
          .slice(i, i + phraseWords.length)
          .map((s) => s.textContent.toLowerCase());
        if (JSON.stringify(potentialMatch) === JSON.stringify(phraseWords)) {
          for (let j = 0; j < phraseWords.length; j++) {
            wordSpans[i + j].classList.add("is-saved");
          }
        }
      }
    });
  }
  return tempDiv.innerHTML;
}

export function renderSubtitleList() {
  dom.subtitleList.innerHTML = "";
  dom.subtitleFilename.textContent = project.subtitleFile || "No file loaded";
  const savedWordsByPartId = new Map();
  project.words.forEach((word) => {
    word.subtitlePartIds.forEach((partId) => {
      if (!savedWordsByPartId.has(partId)) savedWordsByPartId.set(partId, []);
      savedWordsByPartId.get(partId).push(word.word.toLowerCase());
    });
  });
  project.subtitles.forEach((part) => {
    const row =
      dom.subtitleRowTemplate.content.cloneNode(true).firstElementChild;
    row.dataset.partId = part.id;
    row.querySelector(".timestamp").textContent = `[${part.start}]`;
    const phrasesToHighlight = savedWordsByPartId.get(part.id) || [];
    row.querySelector(".sub-text").innerHTML = buildHighlightedText(
      part.text,
      phrasesToHighlight
    );
    dom.subtitleList.appendChild(row);
  });
  if (dom.searchInput.value) {
    dom.searchInput.dispatchEvent(new Event("input"));
  }
}

function handleSubtitleClick(e) {
  const target = e.target;
  const row = target.closest(".sub-row");
  if (!row) return;

  const partId = row.dataset.partId;
  const checkbox = row.querySelector(".sub-checkbox");

  // Handle Checkbox Clicks
  if (target.matches(".sub-checkbox")) {
    if (checkbox.checked) {
      selection.selectedSubtitleIds.add(partId);
      row.classList.add("is-selected");
    } else {
      selection.selectedSubtitleIds.delete(partId);
      row.classList.remove("is-selected");
    }
    updateEditorSentence();
    showEditor();
    return;
  }

  // Handle Word Clicks (for single word or Shift-Click phrase)
  if (target.matches(".sub-word")) {
    if (!checkbox.checked) {
      checkbox.checked = true;
      selection.selectedSubtitleIds.add(partId);
      row.classList.add("is-selected");
      updateEditorSentence();
      showEditor();
    }
    if (e.shiftKey && selection.shiftClickStartWordEl) {
      const allSpans = Array.from(
        dom.subtitleList.querySelectorAll(".sub-word")
      );
      const startIndex = allSpans.indexOf(selection.shiftClickStartWordEl);
      const endIndex = allSpans.indexOf(target);
      if (startIndex !== -1 && endIndex !== -1) {
        const range = [
          Math.min(startIndex, endIndex),
          Math.max(startIndex, endIndex),
        ];
        const phrase = allSpans
          .slice(range[0], range[1] + 1)
          .map((el) => el.textContent)
          .join(" ");
        setEditorWord(phrase);
      }
      selection.shiftClickStartWordEl = null;
    } else {
      setEditorWord(target.textContent);
      selection.shiftClickStartWordEl = target;
    }
  }
}

function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    project.subtitles = parseSubtitleContent(e.target.result);
    project.subtitleFile = file.name;
    project.words = [];
    clearEditor();
    updateWordCounter();
    renderSubtitleList();
    dom.editorPlaceholder.innerHTML = `${ICONS.pointer}<p>Click a word to start.</p>`;
  };
  reader.readAsText(file);
}

function initSearch() {
  dom.searchInput.addEventListener("input", () => {
    const searchTerm = dom.searchInput.value.toLowerCase().trim();
    dom.subtitleList.querySelectorAll(".sub-row").forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(searchTerm)
        ? "flex"
        : "none";
    });
  });

  dom.searchClearBtn.addEventListener("click", () => {
    dom.searchInput.value = "";
    dom.searchInput.dispatchEvent(new Event("input")); // Trigger the input event to show all rows
  });
}

export function initSubtitleControls() {
  dom.importSrtBtn.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".srt,.vtt,.ass";
    fileInput.onchange = handleFileImport;
    fileInput.click();
  });
  // Use Event Delegation for all clicks within the subtitle list
  dom.subtitleList.addEventListener("click", handleSubtitleClick);
  initSearch();
}
