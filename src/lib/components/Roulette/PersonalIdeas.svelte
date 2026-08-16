<script lang="ts">
  import { onDestroy } from "svelte";
  import { m } from "$lib/paraglide/messages";
  import type { RouletteClient } from "$lib/roulette";

  let { client }: { client: RouletteClient } = $props();

  let content = $state("");
  let textareaEl: HTMLTextAreaElement | undefined = $state();
  let sendTimer: ReturnType<typeof setTimeout> | undefined;

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

<style lang="sass">
textarea
  flex: 1
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
  resize: none
  &:focus
    outline: none
    border-color: var(--ss-line-strong)
</style>
