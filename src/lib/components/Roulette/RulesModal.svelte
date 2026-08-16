<script lang="ts">
  import { Button, Modal } from "dssoca";
  import { m } from "$lib/paraglide/messages";

  let { onclose }: { onclose: () => void } = $props();

  let open = $state(true);

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

<Modal bind:open title={m.roulette_rules_title()} size="md" {onclose}>
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

  {#snippet footer()}
    <Button variant="primary" onclick={() => (open = false)}>{m.roulette_got_it()}</Button>
  {/snippet}
</Modal>

<style lang="sass">
.rule
  display: flex
  gap: 10px
  font-size: 12.5px
  line-height: 1.8
  color: var(--ss-fg)
  margin-bottom: 4px
  .n
    color: var(--ss-accent)
    font-family: var(--ss-font-mono)
    flex: none
    min-width: 22px
  &.sub
    padding-left: 22px
    color: var(--ss-fg-muted)
    font-size: 12px
    .n
      color: color-mix(in srgb, var(--ss-accent) 65%, transparent)

.sect
  font-family: var(--ss-font-mono)
  font-size: 10.5px
  color: var(--ss-fg-faint)
  text-transform: uppercase
  letter-spacing: 0.06em
  border-top: 1px solid var(--ss-line)
  margin: 10px 0 8px
  padding-top: 10px
</style>
