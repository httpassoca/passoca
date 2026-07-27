<script lang="ts">
  import { onDestroy } from "svelte";
  import { marked } from "marked";
  import { m } from "$lib/paraglide/messages";
  import type { RouletteClient } from "$lib/roulette";

  let { client }: { client: RouletteClient } = $props();

  let content = $state("");
  let textareaEl: HTMLTextAreaElement | undefined = $state();
  let sendTimer: ReturnType<typeof setTimeout> | undefined;

  // Raw HTML is neutralised before markdown parsing, same as the shared draft.
  const renderMd = (text: string) =>
    marked.parse(text.replace(/&/g, "&amp;").replace(/</g, "&lt;")) as string;

  // Server pushes (initial load + edits from another device). Never clobber
  // the textarea mid-typing — the focused device is the source of truth.
  $effect(() =>
    client.personal.subscribe((remote) => {
      if (document.activeElement !== textareaEl) content = remote;
    })
  );

  function onInput() {
    clearTimeout(sendTimer);
    sendTimer = setTimeout(() => client.setPersonal(content), 500);
  }

  onDestroy(() => clearTimeout(sendTimer));
</script>

<div class="panes">
  <textarea
    bind:this={textareaEl}
    bind:value={content}
    oninput={onInput}
    onblur={() => {
      clearTimeout(sendTimer);
      client.setPersonal(content);
    }}
    placeholder={m.roulette_personal_placeholder()}
    maxlength={20000}
    spellcheck="false"
  ></textarea>
  <div class="md-view">
    {#if content.trim()}
      {@html renderMd(content)}
    {:else}
      <span class="placeholder">{m.roulette_preview_empty()}</span>
    {/if}
  </div>
</div>

<style lang="sass">
.panes
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 10px
  align-items: stretch
  @media (max-width: 760px)
    grid-template-columns: 1fr

textarea
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-inset)
  color: var(--ss-fg)
  font-family: var(--ss-font-mono, monospace)
  font-size: 14px
  line-height: 1.5
  padding: 10px 12px
  min-height: 180px
  width: 100%
  min-width: 0
  resize: vertical
  &:focus
    outline: none
    border-color: var(--ss-line-strong)

.md-view
  background: var(--ss-bg-inset)
  border: 1px solid var(--ss-line)
  padding: 12px 14px
  min-height: 180px
  min-width: 0
  max-height: 60vh
  overflow-y: auto
  overflow-wrap: anywhere
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
