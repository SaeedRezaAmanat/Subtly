import { dom } from "./dom.js";
import { ICONS } from "./icons.js";
import { project } from "./state.js";
import { escapeHtml } from "./utils.js";
import { loadWordForEdit } from "./ui_editor.js";
import { saveProject } from "./storage.js";
import { renderSubtitleList } from "./ui_subtitles.js";
import { showConfirmation } from "./ui_confirm.js";

// State for this module: keep track of the current sort order
let currentSort = "time"; // Default to chronological order

/**
 * Updates the visual style of the sort buttons based on the current state.
 */
function updateSortButtonStyles() {
  if (currentSort === "time") {
    dom.sortTimeBtn.classList.add("is-active");
    dom.sortAlphaBtn.classList.remove("is-active");
  } else {
    dom.sortTimeBtn.classList.remove("is-active");
    dom.sortAlphaBtn.classList.add("is-active");
  }
}

function openModal() {
  // Sort the list by the current preference before rendering
  if (currentSort === "time") {
    project.words.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  } else {
    project.words.sort((a, b) => a.word.localeCompare(b.word));
  }

  updateSortButtonStyles(); // Ensure buttons are styled correctly on open
  renderPreviewList();
  dom.previewModal.style.display = "flex";
}

function closeModal() {
  dom.previewModal.style.display = "none";
}

async function deleteWord(wordId) {
  const confirmed = await showConfirmation(
    "Are you sure you want to delete this word? This action cannot be undone."
  );

  if (confirmed) {
    project.words = project.words.filter((w) => w.id !== wordId);
    saveProject();
    updateWordCounter();
    renderPreviewList();
    renderSubtitleList();
  }
}

export function updateWordCounter() {
  dom.wordCounter.textContent = `Saved: ${project.words.length}`;
}

function scrollToSubtitle(partId) {
  if (!partId) return;
  const targetRow = dom.subtitleList.querySelector(
    `.sub-row[data-part-id="${partId}"]`
  );
  if (targetRow) {
    targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
    targetRow.classList.add("is-scrolled-to");
    setTimeout(() => {
      targetRow.classList.remove("is-scrolled-to");
    }, 2000);
  }
}

function renderPreviewList() {
  dom.previewList.innerHTML = "";
  if (project.words.length === 0) {
    dom.previewList.innerHTML =
      '<div class="row"><div class="meta">No words saved yet.</div></div>';
    return;
  }

  project.words.forEach((word) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <div style="font-weight:700; font-size: 16px;">${escapeHtml(
            word.word
          )}</div>
          <p class="meta"><strong>Sentence:</strong> ${escapeHtml(
            word.sentence
          )}</p>
          <p class="meta"><strong>Meaning:</strong> ${escapeHtml(
            word.meaning
          )}</p>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-shrink: 0; margin-left: 16px;">
          <button class="btn btn-icon btn-edit" data-id="${
            word.id
          }" title="Edit word">${ICONS.edit}</button>
          <button class="btn btn-icon btn-delete" data-id="${
            word.id
          }" title="Delete word">${ICONS.delete}</button>
        </div>
      </div>
    `;
    dom.previewList.appendChild(row);
  });

  dom.previewList.querySelectorAll(".btn-edit").forEach((btn) =>
    btn.addEventListener("click", () => {
      const wordId = btn.dataset.id;
      const word = project.words.find((w) => w.id === wordId);
      loadWordForEdit(wordId);
      closeModal();
      if (word && word.subtitlePartIds.length > 0) {
        scrollToSubtitle(word.subtitlePartIds[0]);
      }
    })
  );
  dom.previewList
    .querySelectorAll(".btn-delete")
    .forEach((btn) =>
      btn.addEventListener("click", () => deleteWord(btn.dataset.id))
    );
}

export function initPreviewControls() {
  dom.openPreviewBtn.addEventListener("click", openModal);
  dom.closePreviewBtn.addEventListener("click", closeModal);
  dom.previewModal.addEventListener("click", (e) => {
    if (e.target === dom.previewModal) closeModal();
  });

  // Sort by timestamp (chronological)
  dom.sortTimeBtn.addEventListener("click", () => {
    currentSort = "time";
    project.words.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    updateSortButtonStyles();
    renderPreviewList();
  });

  // Sort by word (alphabetical)
  dom.sortAlphaBtn.addEventListener("click", () => {
    currentSort = "alpha";
    project.words.sort((a, b) => a.word.localeCompare(b.word));
    updateSortButtonStyles();
    renderPreviewList();
  });
}
