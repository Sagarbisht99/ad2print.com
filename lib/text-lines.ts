/**
 * Fixed-width line counting shared by the newspaper ad builders.
 *
 * The preview renders ad matter in a newspaper-like column, so pricing uses
 * the same greedy wrap. A word longer than the column is split rather than
 * silently dropped.
 */

export function wrapTextLines(text: string, charsPerLine: number): string[] {
  const max = Math.max(1, Math.round(charsPerLine));
  const normalised = text.replace(/\r\n?/g, "\n").trim();
  if (!normalised) return [];

  return normalised
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => wrapLine(line, max));
}

function wrapLine(line: string, max: number): string[] {
  const lines: string[] = [];
  let current = "";

  for (const rawWord of line.split(/\s+/).filter(Boolean)) {
    let word = rawWord;

    while (word.length > max) {
      if (current) {
        lines.push(current);
        current = "";
      }
      lines.push(word.slice(0, max));
      word = word.slice(max);
    }

    if (!word) continue;

    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= max) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

export function countTextLines(text: string, charsPerLine: number): number {
  return wrapTextLines(text, charsPerLine).length;
}
