import { describe, expect, it } from "vitest";
import { buildSnippet, fold, stripMarkdown } from "./text";

describe("stripMarkdown", () => {
  it("removes YAML frontmatter", () => {
    const raw = `---\ntitle: My post\ntags: [a, b]\n---\n\nHello world`;
    expect(stripMarkdown(raw)).toBe("Hello world");
  });

  it("removes frontmatter with CRLF line endings", () => {
    const raw = `---\r\ntitle: My post\r\n---\r\nHello`;
    expect(stripMarkdown(raw)).toBe("Hello");
  });

  it("removes mdsvex script blocks", () => {
    const raw = `---\ntitle: t\n---\n\n<script lang="ts">\n  import SVG from '$lib/x';\n  const a = 1 < 2;\n</script>\n\nActual content`;
    expect(stripMarkdown(raw)).toBe("Actual content");
  });

  it("drops fenced code blocks but keeps inline code content", () => {
    const raw =
      "Before\n\n```js\nconst secret = 42;\n```\n\nUse `npm install` after";
    const out = stripMarkdown(raw);
    expect(out).not.toContain("secret");
    expect(out).toContain("npm install");
  });

  it("converts links and images to their text", () => {
    const raw = "See [the docs](https://example.com) and ![alt text](/img.png)";
    expect(stripMarkdown(raw)).toBe("See the docs and alt text");
  });

  it("strips html tags, headings, lists and emphasis markers", () => {
    const raw = `# Title\n\n> quote\n\n- item **bold** and _italic_\n\n<div class="x">inside</div>`;
    const out = stripMarkdown(raw);
    expect(out).toBe("Title quote item bold and italic inside");
  });
});

describe("fold", () => {
  it("lowercases and strips accents", () => {
    expect(fold("MÚSICA")).toBe("musica");
    expect(fold("ação")).toBe("acao");
    expect(fold("Ela é você")).toBe("ela e voce");
  });

  it("leaves plain ascii untouched", () => {
    expect(fold("hello")).toBe("hello");
  });
});

describe("buildSnippet", () => {
  const rejoin = (parts: { text: string }[]) =>
    parts.map((p) => p.text).join("");
  const hits = (parts: { text: string; hit: boolean }[]) =>
    parts.filter((p) => p.hit).map((p) => p.text);

  it("marks the matched term and windows around it", () => {
    const body = "aaa ".repeat(50) + "the needle is here" + " bbb".repeat(50);
    const parts = buildSnippet(body, ["needle"]);
    expect(hits(parts)).toEqual(["needle"]);
    const text = rejoin(parts);
    expect(text.startsWith("…")).toBe(true);
    expect(text.endsWith("…")).toBe(true);
    expect(text.length).toBeLessThan(body.length);
  });

  it("highlights the accented original for an accent-less query", () => {
    const body = "Eu adoro ouvir música brasileira todos os dias";
    const parts = buildSnippet(body, ["musica"]);
    expect(hits(parts)).toEqual(["música"]);
    expect(rejoin(parts)).toContain("música brasileira");
  });

  it("survives regex-special queries", () => {
    const body = "I learned c++ at school";
    const parts = buildSnippet(body, ["c++"]);
    expect(hits(parts)).toEqual(["c++"]);
  });

  it("marks every term occurrence inside the window", () => {
    const body = "cats love cats and more cats";
    const parts = buildSnippet(body, ["cats"]);
    expect(hits(parts)).toEqual(["cats", "cats", "cats"]);
  });

  it("falls back to the description when no term matches the body", () => {
    const parts = buildSnippet(
      "body text without it",
      ["zzz"],
      "the description"
    );
    expect(parts).toEqual([{ text: "the description", hit: false }]);
  });

  it("falls back to the body head when there is no description either", () => {
    const body = "word ".repeat(100);
    const parts = buildSnippet(body, ["zzz"]);
    expect(parts).toHaveLength(1);
    expect(parts[0].hit).toBe(false);
    expect(parts[0].text.length).toBeLessThanOrEqual(120);
  });

  it("returns nothing for an empty body and no fallback", () => {
    expect(buildSnippet("", ["term"])).toEqual([]);
  });
});
