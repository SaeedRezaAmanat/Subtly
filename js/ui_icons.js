import { dom } from "./dom.js";
import { ICONS } from "./icons.js";

function setIcon(button, icon) {
  const iconHolder = button.querySelector(".icon-holder");
  if (iconHolder) {
    iconHolder.innerHTML = icon;
  } else {
    button.innerHTML = icon; // For icon-only buttons
  }
}

export function initIcons() {
  // Top Controls
  setIcon(dom.importSrtBtn, ICONS.upload);
  setIcon(dom.importJsonBtn, ICONS.folder);
  setIcon(dom.openHelpBtn, ICONS.help);

  // Bottom Bar
  setIcon(dom.saveJsonBtn, ICONS.save);
  setIcon(dom.exportCsvBtn, ICONS.csv);
  setIcon(dom.exportDocBtn, ICONS.word);
  setIcon(dom.openPreviewBtn, ICONS.preview);

  // Modal Controls
  setIcon(dom.sortTimeBtn, ICONS.time);
  setIcon(dom.sortAlphaBtn, ICONS.alpha);
  setIcon(dom.closePreviewBtn, ICONS.close);
  setIcon(dom.closeHelpBtn, ICONS.close);
}
