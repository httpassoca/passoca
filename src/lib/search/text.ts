// Pure text utilities for the search palette. Keep this module free of DOM,
// `$app` and `$lib/paraglide` imports — it runs under the plugin-less vitest
// config (node environment).

/**
 * Reduce a raw mdsvex/markdown source to plain prose for indexing and
 * excerpts. Fenced code blocks are dropped entirely (noise in one-line
 * excerpts); inline code keeps its content.
 */
export function stripMarkdown(raw: string): string {
  let text = raw;

  // YAML frontmatter
  text = text.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, "");
  // mdsvex component scripts
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  // <style> blocks, just in case a post carries one
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  // fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, " ");
  // images -> alt text
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  // links -> link text
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // residual HTML / Svelte tags
  text = text.replace(/<[^>]+>/g, " ");
  // table separator rows and pipes
  text = text.replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ");
  text = text.replace(/\|/g, " ");
  // heading markers, blockquotes, list markers
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  text = text.replace(/^\s{0,3}>\s?/gm, "");
  text = text.replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "");
  // emphasis / strikethrough / inline-code markers
  text = text.replace(/(\*\*|__|[*_~`])/g, "");
  // collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/** Lowercase + strip combining accents ("música" -> "musica"). */
export function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export type SnippetPart = { text: string; hit: boolean };

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Build a ~one-line excerpt of `body` around the first match of the longest
 * term, with matched ranges marked `hit: true`.
 *
 * Matching happens on a folded (lowercased, accent-stripped) copy of the
 * body. `fold` strips combining marks per code point, so an index into the
 * folded string maps back to the same code-point index in the original —
 * that's what lets an accent-less query highlight the accented original.
 */
export function buildSnippet(
  body: string,
  terms: string[],
  fallback = "",
  radius = 60
): SnippetPart[] {
  const chars = Array.from(body);
  const foldedChars = chars.map((c) => fold(c));
  const folded = foldedChars.join("");

  // fold() can change a char's length (e.g. drops a combining mark, or "ﬁ"
  // -> "fi"), so track each folded index back to its original char index.
  const toOriginal: number[] = [];
  for (let i = 0; i < foldedChars.length; i++) {
    for (let j = 0; j < foldedChars[i].length; j++) toOriginal.push(i);
  }

  const cleaned = terms
    .map((t) => fold(t.trim()))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  const anchorTerm = cleaned.find((t) => folded.includes(t));
  if (!anchorTerm) {
    const text = fallback || chars.slice(0, 120).join("");
    return text ? [{ text, hit: false }] : [];
  }

  // Window (in folded indices) around the anchor, expanded to word bounds.
  const anchorStart = folded.indexOf(anchorTerm);
  let winStart = Math.max(0, anchorStart - radius);
  let winEnd = Math.min(
    folded.length,
    anchorStart + anchorTerm.length + radius
  );
  while (winStart > 0 && !/\s/.test(folded[winStart - 1])) winStart--;
  while (winEnd < folded.length && !/\s/.test(folded[winEnd])) winEnd++;

  // Collect hit ranges (folded indices) for every term inside the window.
  const pattern = new RegExp(cleaned.map(escapeRegex).join("|"), "g");
  const ranges: [number, number][] = [];
  const windowText = folded.slice(winStart, winEnd);
  for (const match of windowText.matchAll(pattern)) {
    const start = winStart + (match.index ?? 0);
    const end = start + match[0].length;
    const last = ranges[ranges.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else ranges.push([start, end]);
  }

  // Map folded ranges back to the original string and assemble parts.
  const orig = (foldedIdx: number) =>
    foldedIdx >= toOriginal.length ? chars.length : toOriginal[foldedIdx];
  const parts: SnippetPart[] = [];
  const push = (from: number, to: number, hit: boolean) => {
    const text = chars.slice(from, to).join("");
    if (text) parts.push({ text, hit });
  };

  let cursor = orig(winStart);
  if (winStart > 0) parts.push({ text: "…", hit: false });
  for (const [start, end] of ranges) {
    push(cursor, orig(start), false);
    push(orig(start), orig(end), true);
    cursor = orig(end);
  }
  push(cursor, orig(winEnd), false);
  if (winEnd < folded.length) parts.push({ text: "…", hit: false });

  return parts;
}
