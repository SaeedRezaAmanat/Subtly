import { dom } from "./dom.js";

/**
 * Applies the given theme ('dark' or 'light') to the document.
 * @param {string} theme
 */
function applyTheme(theme) {
  if (theme === "dark") {
    dom.html.classList.add("dark-mode");
  } else {
    dom.html.classList.remove("dark-mode");
  }
  // Save the preference to localStorage
  localStorage.setItem("subtly_theme", theme);
}

/**
 * Toggles the theme between light and dark.
 */
function toggleTheme() {
  const currentTheme = dom.html.classList.contains("dark-mode")
    ? "light"
    : "dark";
  applyTheme(currentTheme);
}

/**
 * Initializes the theme based on saved preference or OS setting.
 */
export function initTheme() {
  const savedTheme = localStorage.getItem("subtly_theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  dom.themeToggleBtn.addEventListener("click", toggleTheme);
}
