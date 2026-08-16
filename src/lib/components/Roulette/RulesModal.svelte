<script lang="ts">
  import { m } from "$lib/paraglide/messages";

  let { onclose }: { onclose: () => void } = $props();

  const rules = $derived([
    m.roulette_rule_1(),
    m.roulette_rule_2(),
    m.roulette_rule_3(),
    m.roulette_rule_4(),
    m.roulette_rule_5(),
  ]);
  const filmRules = $derived([
    m.roulette_rule_5_1(),
    m.roulette_rule_5_2(),
    m.roulette_rule_5_3(),
    m.roulette_rule_5_4(),
  ]);
  const goodwill = $derived([
    m.roulette_goodwill_1(),
    m.roulette_goodwill_2(),
    m.roulette_goodwill_3(),
    m.roulette_goodwill_4(),
  ]);
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape") onclose();
  }}
/>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions
     (backdrop click is a pointer shortcut; keyboard users have Escape and the ✕ button) -->
<div
  class="hub-overlay"
  role="dialog"
  aria-modal="true"
  tabindex="-1"
  onclick={(e) => {
    if (e.target === e.currentTarget) onclose();
  }}
>
  <div class="hub-panel modal">
    <div class="hub-panel-head">
      <div class="title">{m.roulette_rules_title()}</div>
      <button class="hub-btn ghost" onclick={onclose}>✕</button>
    </div>
    <div class="hub-panel-body">
      {#each rules as rule, i}
        <div class="rule">
          <span class="n">{String(i + 1).padStart(2, "0")}</span>
          <span>{rule}</span>
        </div>
      {/each}
      {#each filmRules as rule, i}
        <div class="rule sub">
          <span class="n">5.{i + 1}</span>
          <span>{rule}</span>
        </div>
      {/each}

      <div class="sect">{m.roulette_goodwill_title()}</div>
      {#each goodwill as item}
        <div class="rule">
          <span class="n">·</span>
          <span>{item}</span>
        </div>
      {/each}

      <div class="foot">
        <button class="hub-btn primary" onclick={onclose}>{m.roulette_got_it()}</button>
      </div>
    </div>
  </div>
</div>

<style lang="sass">
.modal
  width: 480px
  max-width: 90vw

.rule
  display: flex
  gap: 10px
  font-size: 12.5px
  line-height: 1.8
  color: var(--hs-fg)
  margin-bottom: 4px
  .n
    color: var(--hs-primary)
    font-family: var(--hs-font-mono)
    flex: none
    min-width: 22px
  &.sub
    padding-left: 22px
    color: var(--hs-fg-muted)
    font-size: 12px
    .n
      color: color-mix(in srgb, var(--hs-primary) 65%, transparent)

.sect
  font-family: var(--hs-font-mono)
  font-size: 10.5px
  color: var(--hs-fg-faint)
  text-transform: uppercase
  letter-spacing: 0.06em
  border-top: 1px solid var(--hs-line)
  margin: 10px 0 8px
  padding-top: 10px

.foot
  display: flex
  justify-content: flex-end
  margin-top: 10px
</style>
