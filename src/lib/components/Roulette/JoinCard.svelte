<script lang="ts">
  import { Button, Card, Input } from "dssoca";
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

<div class="join">
  <Card title={m.roulette_who_are_you()}>
    <form
      class="row"
      onsubmit={(e) => {
        e.preventDefault();
        onjoin();
      }}
    >
      <Input
        label={m.roulette_name()}
        placeholder={m.roulette_name_placeholder()}
        maxlength={24}
        bind:value={draftName}
      />
      {#if isAdmin(draftName)}
        <Input
          label={m.roulette_password()}
          type="password"
          bind:value={draftPassword}
        />
      {/if}
      <Button type="submit" disabled={!draftName.trim()}>{m.roulette_join()}</Button>
    </form>
  </Card>
</div>

<style lang="sass">
.join
  max-width: 440px
  margin: 16px 0 20px

.row
  display: flex
  align-items: flex-start
  gap: var(--ss-gap, 10px)
  :global(label)
    flex: 1
  :global(button[type="submit"])
    margin-top: 22px
</style>
