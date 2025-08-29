/**
 * Parses subtitle content from SRT, VTT, or ASS formats.
 * @param {string} content The raw text content of the subtitle file.
 */
export function parseSubtitleContent(content) {
  // Normalize line endings
  const text = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // --- .ASS Format Detection and Parsing ---
  if (text.includes("[Events]")) {
    const lines = text.split("\n");
    const eventsIndex = lines.findIndex(
      (line) => line.trim().toLowerCase() === "[events]"
    );
    if (eventsIndex === -1) return [];

    const eventLines = lines.slice(eventsIndex + 1);
    const parts = [];

    // Find the format line to know which columns are Start, End, and Text
    const formatLine = eventLines.find((line) => line.startsWith("Format:"));
    if (!formatLine) return []; // Cannot parse without format line
    const formatParts = formatLine
      .split(":")[1]
      .split(",")
      .map((s) => s.trim());
    const startIndex = formatParts.indexOf("Start");
    const endIndex = formatParts.indexOf("End");
    const textIndex = formatParts.indexOf("Text");

    if (startIndex === -1 || endIndex === -1 || textIndex === -1) return [];

    eventLines.forEach((line, index) => {
      if (line.startsWith("Dialogue:")) {
        const dialogueParts = line.split(":")[1].split(",");
        const textContent = dialogueParts.slice(textIndex).join(",");

        // Strip out ASS styling tags like {\i1\b0}
        const cleanText = textContent.replace(/{[^}]*}/g, "").trim();

        parts.push({
          id: `p${index + 1}`,
          start: dialogueParts[startIndex] || "",
          end: dialogueParts[endIndex] || "",
          text: cleanText,
        });
      }
    });
    return parts;
  }

  // --- .SRT / .VTT Fallback Parser ---
  const srtText = text.replace(/^WEBVTT\n\n/, ""); // Remove optional VTT header
  if (!srtText) return [];

  const blocks = srtText.split(/\n{2,}/g);
  return blocks
    .map((block, index) => {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length < 2) return null;

      const timeLineIdx = lines.findIndex((l) => l.includes("-->"));
      if (timeLineIdx === -1) return null;

      const timeLine = lines[timeLineIdx];
      const textLines = lines.slice(timeLineIdx + 1).join(" ");

      const [start, end] = timeLine
        .split("-->")
        .map((s) => s.trim().replace(",", ".").split(".")[0]);

      return {
        id: `p${index + 1}`,
        start: start || "",
        end: end || "",
        text: textLines,
      };
    })
    .filter(Boolean);
}
