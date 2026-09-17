import { TIER_COLORS } from "./tierlist";
import { tmdbImg } from "./media";
import type { TierItem, TierName } from "./types";

/** One rendered row of the exported image. */
export interface ExportRow {
  tier: TierName;
  items: TierItem[];
}

// Layout in CSS px, mirroring the on-screen tierlist (108px 2:3 tiles, 44px
// letter column, 6px gaps); the canvas is drawn at 2× for crispness.
const SCALE = 2;
const TILE_W = 108;
const TILE_H = 162;
const GAP = 6;
const LETTER_W = 44;
const LETTER_GAP = 8;
const STRIP_PAD = 6;
const PER_ROW = 8;
const PAD = 24;
const ROW_GAP = 6;
const HEADER_H = 66;
const STRIP_W = PER_ROW * TILE_W + (PER_ROW - 1) * GAP + 2 * STRIP_PAD;
const WIDTH = PAD * 2 + LETTER_W + LETTER_GAP + STRIP_W;

/** Design tokens resolved to concrete values at export time (theme-accurate). */
interface Palette {
  bg: string;
  bgElev: string;
  bgInset: string;
  line: string;
  fg: string;
  fgMuted: string;
  fgFaint: string;
  fontDisplay: string;
  fontBody: string;
  fontMono: string;
  tier: Record<TierName, string>;
}

function resolvePalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const token = (name: string) => styles.getPropertyValue(name).trim();
  // TIER_COLORS values are `var(--ss-*)` strings; unwrap to the raw color.
  const unwrap = (value: string) => {
    const inner = value.match(/^var\((--[\w-]+)\)$/);
    return inner ? token(inner[1]) : value;
  };
  return {
    bg: token("--ss-bg"),
    bgElev: token("--ss-bg-elev"),
    bgInset: token("--ss-bg-inset"),
    line: token("--ss-line"),
    fg: token("--ss-fg"),
    fgMuted: token("--ss-fg-muted"),
    fgFaint: token("--ss-fg-faint"),
    fontDisplay: token("--ss-font-display") || "sans-serif",
    fontBody: token("--ss-font-body") || "sans-serif",
    fontMono: token("--ss-font-mono") || "monospace",
    tier: Object.fromEntries(
      (Object.keys(TIER_COLORS) as TierName[]).map((t) => [t, unwrap(TIER_COLORS[t])])
    ) as Record<TierName, string>,
  };
}

/** TMDB's CDN sends CORS headers, so posters can be drawn without tainting. */
function loadPoster(path: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = tmdbImg(path, "w342");
  });
}

function rowHeight(count: number): number {
  const lines = Math.max(1, Math.ceil(count / PER_ROW));
  return count === 0
    ? 2 * STRIP_PAD + 62 // matches the on-screen empty strip's min-height
    : 2 * STRIP_PAD + lines * TILE_H + (lines - 1) * GAP;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/)) {
    const next = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number) {
  const scale = Math.max(TILE_W / img.naturalWidth, TILE_H / img.naturalHeight);
  const sw = TILE_W / scale;
  const sh = TILE_H / scale;
  ctx.drawImage(
    img,
    (img.naturalWidth - sw) / 2,
    (img.naturalHeight - sh) / 2,
    sw,
    sh,
    x,
    y,
    TILE_W,
    TILE_H
  );
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  item: TierItem,
  poster: HTMLImageElement | null,
  x: number,
  y: number,
  p: Palette
) {
  ctx.fillStyle = p.bgInset;
  ctx.fillRect(x, y, TILE_W, TILE_H);
  if (poster) {
    drawCover(ctx, poster, x, y);
  } else {
    // No poster: title text, bottom-aligned like the on-screen tile.
    ctx.font = `11px ${p.fontBody}`;
    ctx.fillStyle = p.fgMuted;
    ctx.textBaseline = "alphabetic";
    const lines = wrapText(ctx, item.title, TILE_W - 8).slice(0, 5);
    const lineH = 14;
    lines.forEach((line, i) => {
      ctx.fillText(line, x + 4, y + TILE_H - 6 - (lines.length - 1 - i) * lineH, TILE_W - 8);
    });
  }
  ctx.strokeStyle = p.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE_W - 1, TILE_H - 1);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Renders tier rows to an offscreen canvas in the active theme's tokens and
 * downloads the result as a JPG. Posters that fail to load fall back to the
 * text tile, so a flaky image never blocks the export.
 */
export async function exportTierlistJpg(opts: {
  rows: ExportRow[];
  title: string;
  subtitle: string;
  filename: string;
}): Promise<void> {
  const { rows, title, subtitle, filename } = opts;
  const p = resolvePalette();
  await document.fonts.ready;

  const posterPaths = [
    ...new Set(rows.flatMap((r) => r.items.flatMap((i) => (i.poster_path ? [i.poster_path] : [])))),
  ];
  const posters = new Map<string, HTMLImageElement | null>(
    await Promise.all(
      posterPaths.map(async (path) => [path, await loadPoster(path)] as const)
    )
  );

  const heights = rows.map((r) => rowHeight(r.items.length));
  const height =
    PAD + HEADER_H + heights.reduce((a, b) => a + b, 0) + (rows.length - 1) * ROW_GAP + PAD;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = height * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  ctx.scale(SCALE, SCALE);

  // JPEG has no alpha — the page background is the ground.
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, WIDTH, height);

  ctx.textBaseline = "alphabetic";
  ctx.font = `24px ${p.fontDisplay}`;
  ctx.fillStyle = p.fg;
  ctx.fillText(title, PAD, PAD + 24, WIDTH - 2 * PAD);
  ctx.font = `12px ${p.fontMono}`;
  ctx.fillStyle = p.fgFaint;
  ctx.fillText(subtitle, PAD, PAD + 44, WIDTH - 2 * PAD);

  let y = PAD + HEADER_H;
  rows.forEach((row, i) => {
    const h = heights[i];
    const color = p.tier[row.tier];

    // Letter block: tinted fill + border, like TierRow's color-mix.
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = color;
    ctx.fillRect(PAD, y, LETTER_W, h);
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(PAD + 0.5, y + 0.5, LETTER_W - 1, h - 1);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.font = `18px ${p.fontDisplay}`;
    ctx.textAlign = "center";
    ctx.fillText(row.tier, PAD + LETTER_W / 2, y + h / 2 + 6);
    ctx.textAlign = "left";

    const stripX = PAD + LETTER_W + LETTER_GAP;
    ctx.fillStyle = p.bgElev;
    ctx.fillRect(stripX, y, STRIP_W, h);
    ctx.strokeStyle = p.line;
    ctx.strokeRect(stripX + 0.5, y + 0.5, STRIP_W - 1, h - 1);

    row.items.forEach((item, j) => {
      const x = stripX + STRIP_PAD + (j % PER_ROW) * (TILE_W + GAP);
      const ty = y + STRIP_PAD + Math.floor(j / PER_ROW) * (TILE_H + GAP);
      drawTile(ctx, item, posters.get(item.poster_path ?? "") ?? null, x, ty, p);
    });

    y += h + ROW_GAP;
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92)
  );
  if (!blob) throw new Error("jpeg encoding failed");
  triggerDownload(blob, filename);
}

/** Canonical TMDB page for a ranked film, when it came from TMDB. */
function tmdbUrl(item: TierItem): string | null {
  return item.media_type && item.tmdb_id
    ? `https://www.themoviedb.org/${item.media_type}/${item.tmdb_id}`
    : null;
}

/** Builds the Markdown document for a tierlist: one section per tier. */
export function tierlistMarkdown(opts: {
  rows: ExportRow[];
  title: string;
  subtitle: string;
  emptyLabel: string;
}): string {
  const { rows, title, subtitle, emptyLabel } = opts;
  const lines: string[] = [`# ${title}`, "", `_${subtitle}_`, ""];
  for (const row of rows) {
    lines.push(`## ${row.tier}`, "");
    if (row.items.length === 0) {
      lines.push(`_${emptyLabel}_`);
    } else {
      row.items.forEach((item, i) => {
        const year = item.media_year ? ` (${item.media_year})` : "";
        const url = tmdbUrl(item);
        const label = url ? `[${item.title}](${url})` : item.title;
        lines.push(`${i + 1}. ${label}${year}`);
      });
    }
    lines.push("");
  }
  return lines.join("\n");
}

/** Downloads the tierlist as a `.md` file — no rendering, so it never fails on posters. */
export function exportTierlistMarkdown(
  opts: Parameters<typeof tierlistMarkdown>[0] & { filename: string }
): void {
  const blob = new Blob([tierlistMarkdown(opts)], { type: "text/markdown;charset=utf-8" });
  triggerDownload(blob, opts.filename);
}
