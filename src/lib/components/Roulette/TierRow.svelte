<script lang="ts">
  import type { Snippet } from "svelte";
  import { TIER_COLORS, type TierName } from "$lib/roulette";

  let { tier, children }: { tier: TierName; children: Snippet } = $props();
</script>

<div class="tier-row">
  <div class="letter" style:--tier-color={TIER_COLORS[tier]}>{tier}</div>
  <div class="strip">
    {@render children()}
  </div>
</div>

<style lang="sass">
.tier-row
  display: flex
  align-items: stretch
  gap: 8px

.letter
  width: 44px
  flex: none
  display: flex
  align-items: center
  justify-content: center
  font-family: var(--ss-font-display)
  font-size: 18px
  color: var(--tier-color)
  border: 1px solid color-mix(in srgb, var(--tier-color) 40%, transparent)
  background: color-mix(in srgb, var(--tier-color) 12%, transparent)

.strip
  flex: 1
  min-width: 0
  display: flex
  flex-wrap: wrap
  gap: 6px
  align-items: center
  min-height: 62px
  padding: 6px
  border: 1px solid var(--ss-line)
  background: var(--ss-bg-elev)
</style>
