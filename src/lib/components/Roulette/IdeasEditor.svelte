<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as Y from "yjs";
  import type { Awareness } from "y-protocols/awareness";
  import { marked } from "marked";

  let {
    doc,
    awareness,
    name,
    color,
  }: {
    doc: Y.Doc;
    awareness: Awareness;
    name: string;
    color: string;
  } = $props();

  let host: HTMLDivElement;
  let preview = $state("");
  let showPreview = $state(false);
  let view: import("@codemirror/view").EditorView | null = null;
  let ytext: Y.Text | null = null;
  let observer: (() => void) | null = null;

  // Raw HTML is neutralised before markdown parsing — friends' text renders on
  // each other's screens.
  const renderMd = (text: string) =>
    marked.parse(text.replace(/&/g, "&amp;").replace(/</g, "&lt;")) as string;

  function toLight(hex: string) {
    return `${hex}33`;
  }

  // Keep the awareness "user" field in sync so remote cursors are labelled.
  $effect(() => {
    if (!awareness) return;
    awareness.setLocalStateField("user", {
      name: name || "anon",
      color,
      colorLight: toLight(color),
    });
  });

  onMount(async () => {
    const [{ EditorState }, cmView, { markdown }, { yCollab }, { basicSetup }] =
      await Promise.all([
        import("@codemirror/state"),
        import("@codemirror/view"),
        import("@codemirror/lang-markdown"),
        import("y-codemirror.next"),
        import("codemirror"),
      ]);
    const { EditorView } = cmView;

    ytext = doc.getText("content");
    preview = ytext.toString();
    observer = () => (preview = ytext?.toString() ?? "");
    ytext.observe(observer);

    const undoManager = new Y.UndoManager(ytext);
    awareness.setLocalStateField("user", {
      name: name || "anon",
      color,
      colorLight: toLight(color),
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        markdown(),
        EditorView.lineWrapping,
        yCollab(ytext, awareness, { undoManager }),
        EditorView.theme({
          "&": { fontSize: "14px", backgroundColor: "var(--ss-bg-inset)" },
          ".cm-content": {
            fontFamily: "var(--ss-font-mono, monospace)",
            minHeight: "220px",
          },
          "&.cm-focused": { outline: "none" },
          ".cm-gutters": {
            backgroundColor: "var(--ss-bg-inset)",
            border: "none",
            color: "var(--ss-fg-faint)",
          },
        }),
      ],
    });

    view = new EditorView({ state, parent: host });
  });

  onDestroy(() => {
    if (ytext && observer) ytext.unobserve(observer);
    view?.destroy();
  });
</script>

<div class="ideas-editor">
  <div class="bar">
    <span class="hint">Shared draft — everyone edits together. Markdown supported.</span>
    <button
      type="button"
      class="toggle"
      onclick={() => (showPreview = !showPreview)}
    >
      {showPreview ? "Edit" : "Preview"}
    </button>
  </div>

  <div class="editor" class:hidden={showPreview} bind:this={host}></div>

  {#if showPreview}
    <div class="md-view">
      {#if preview.trim()}
        {@html renderMd(preview)}
      {:else}
        <span class="placeholder">Nothing written yet.</span>
      {/if}
    </div>
  {/if}
</div>

<style lang="sass">
.ideas-editor
  display: flex
  flex-direction: column
  gap: 8px

.bar
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px

.hint
  color: var(--ss-fg-muted)
  font-size: var(--ss-size-sm)

.toggle
  background: var(--ss-bg-inset)
  border: 1px solid var(--ss-line)
  color: var(--ss-fg)
  font: inherit
  font-size: var(--ss-size-sm)
  padding: 4px 10px
  cursor: pointer
  &:hover
    border-color: var(--ss-line-strong)

.editor
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-inset)
  &.hidden
    display: none
  :global(.cm-editor)
    max-height: 60vh

.md-view
  background: var(--ss-bg-inset)
  border: 1px solid var(--ss-line)
  padding: 12px 14px
  min-height: 220px
  .placeholder
    color: var(--ss-fg-faint)

.md-view :global
  h1, h2, h3, h4
    font-size: var(--ss-size-h3)
    margin: 10px 0 4px
  h1:first-child, h2:first-child, h3:first-child, p:first-child
    margin-top: 0
  p
    margin: 6px 0
  ul, ol
    margin: 6px 0
    padding-left: 20px
  ul
    list-style: disc
  ol
    list-style: decimal
  code
    font-family: var(--ss-font-mono)
    background: var(--ss-code-bg)
    padding: 0 4px
  a
    border-bottom: 1px solid var(--ss-accent)
  blockquote
    border-left: 2px solid var(--ss-line-strong)
    padding-left: 10px
    color: var(--ss-fg-muted)
  hr
    border: none
    border-top: 1px solid var(--ss-line)
    margin: 10px 0
</style>
