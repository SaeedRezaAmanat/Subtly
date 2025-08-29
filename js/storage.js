import { project, resetProject } from "./state.js";

const STORAGE_KEY = "subtly_project_v1";

export function saveProject() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch (err) {
    console.error("Failed to save project to localStorage:", err);
  }
}

export function loadProject() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return;

    const loadedProject = JSON.parse(rawData);
    if (loadedProject && loadedProject.subtitles && loadedProject.words) {
      Object.assign(project, loadedProject);
    }
  } catch (err) {
    console.warn(
      "Failed to load project from localStorage. Starting fresh.",
      err
    );
    resetProject();
  }
}
