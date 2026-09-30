<script lang="ts">
  import { Input, Select } from "dssoca";
  import { m } from "$lib/paraglide/messages";

  let {
    value = $bindable(""),
    pickers,
    label = m.roulette_history_add_author(),
  }: {
    /** The picker's name; `""` = the film has no picker. */
    value?: string;
    /** Names already known to the roulette, offered as options. */
    pickers: string[];
    label?: string;
  } = $props();

  // Select value for "type a new name". Names are trimmed everywhere, so a
  // leading space can never collide with a real one.
  const NEW = " new";
  let adding = $state(false);

  const options = $derived([
    { value: "", label: m.roulette_picker_none() },
    // The current picker stays selectable even when nothing else carries it.
    ...[...new Set(adding || !value ? pickers : [...pickers, value])]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ value: name, label: name })),
    { value: NEW, label: m.roulette_picker_new() },
  ]);

  function select(e: Event & { currentTarget: HTMLSelectElement }) {
    const picked = e.currentTarget.value;
    adding = picked === NEW;
    value = adding ? "" : picked;
  }
</script>

<div class="picker">
  <div class="field">
    <Select {label} value={adding ? NEW : value} {options} onchange={select} />
  </div>
  {#if adding}
    <div class="field">
      <Input label={m.roulette_picker_new_label()} maxlength={24} bind:value />
    </div>
  {/if}
</div>

<style lang="sass">
.picker
  display: flex
  align-items: flex-end
  gap: 8px
  flex-wrap: wrap

.field
  flex: 1
  min-width: 140px
</style>
