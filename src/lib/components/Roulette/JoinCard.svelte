<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { isAdmin } from "$lib/roulette";

  let {
    draftName = $bindable(),
    draftPassword = $bindable(),
    onjoin,
  }: {
    draftName: string;
    draftPassword: string;
    onjoin: () => void;
  } = $props();
</script>

<div class="hub-panel join">
  <div class="hub-panel-head">
    <div class="title">{m.roulette_who_are_you()}</div>
  </div>
  <form
    class="hub-panel-body row"
    onsubmit={(e) => {
      e.preventDefault();
      onjoin();
    }}
  >
    <label class="hub-field grow">
      <span class="lbl">{m.roulette_name()}</span>
      <input
        class="hub-input"
        placeholder={m.roulette_name_placeholder()}
        maxlength={24}
        bind:value={draftName}
      />
    </label>
    {#if isAdmin(draftName)}
      <label class="hub-field grow">
        <span class="lbl">{m.roulette_password()}</span>
        <input class="hub-input" type="password" bind:value={draftPassword} />
      </label>
    {/if}
    <button class="hub-btn primary" type="submit" disabled={!draftName.trim()}>
      {m.roulette_join()}
    </button>
  </form>
</div>

<style lang="sass">
.join
  max-width: 480px
  margin: 0 0 12px

.row
  display: flex
  align-items: flex-end
  gap: 8px

.grow
  flex: 1

button[type="submit"]
  padding: 10px 14px
</style>
