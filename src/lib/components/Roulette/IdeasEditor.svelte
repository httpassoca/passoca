<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as Y from "yjs";
  import type { Awareness } from "y-protocols/awareness";
  import { m } from "$lib/paraglide/messages";

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
  let view: import("@codemirror/view").EditorView | null = null;
  let ytext: Y.Text | null = null;

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
    view?.destroy();
  });
</script>

<div class="ideas-editor">
  <div class="bar">
    <span class="hint">{m.roulette_ideas_hint()}</span>
  </div>

  <div class="editor" bind:this={host}></div>
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

.editor
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-inset)
  min-width: 0
  :global(.cm-editor)
    max-height: 60vh
</style>
