// The main data object for the entire application
export const project = {
  subtitleFile: "",
  subtitles: [], // Array of { id, start, end, text }
  words: [], // Array of { id, word, sentence, meaning, note, ... }
};

// The current UI selection state
export const selection = {
  selectedSubtitleIds: new Set(),
  editingWordId: null,
  shiftClickStartWordEl: null, // <-- ADD THIS LINE to store the starting word element
};

// Function to reset the project to its initial state
export function resetProject() {
  project.subtitleFile = "";
  project.subtitles.length = 0;
  project.words.length = 0;
  selection.selectedSubtitleIds.clear();
  selection.editingWordId = null;
  selection.shiftClickStartWordEl = null; // <-- Also reset it here
}
