<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import { isAdmin } from "$lib/roulette";
  import { Button, Card, Input } from "dssoca";

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
      <div class="grow">
        <Input
          label={m.roulette_name()}
          placeholder={m.roulette_name_placeholder()}
          maxlength={24}
          bind:value={draftName}
        />
      </div>
      {#if isAdmin(draftName)}
        <div class="grow">
          <Input label={m.roulette_password()} type="password" bind:value={draftPassword} />
        </div>
      {/if}
      <Button type="submit" variant="primary" disabled={!draftName.trim()}>
        {m.roulette_join()}
      </Button>
    </form>
  </Card>
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
</style>
