<script lang="ts">
  import type { Presence } from "$lib/roulette";
  import { colorForName } from "$lib/roulette";

  let { users, me }: { users: Presence[]; me: string } = $props();
</script>

<div class="online">
  <span class="label">Online</span>
  <span class="count">{users.length}</span>
  <ul>
    {#each users as user (user.name)}
      <li>
        <span
          class="dot"
          style:background={user.color ?? colorForName(user.name)}
        ></span>
        <span class="name" class:me={user.name === me}>{user.name}</span>
      </li>
    {/each}
    {#if users.length === 0}
      <li class="empty">No one online</li>
    {/if}
  </ul>
</div>

<style lang="sass">
.online
  display: flex
  align-items: center
  flex-wrap: wrap
  gap: 8px

.label
  font-size: var(--ss-size-sm)
  font-family: var(--ss-font-mono)
  color: var(--ss-fg-muted)

.count
  font-size: var(--ss-size-sm)
  background: var(--ss-bg-inset)
  border: 1px solid var(--ss-line)
  padding: 0 6px

ul
  display: flex
  flex-wrap: wrap
  gap: 6px 12px
  list-style: none
  margin: 0
  padding: 0

li
  display: flex
  align-items: center
  gap: 6px
  font-size: var(--ss-size-sm)

.dot
  width: 9px
  height: 9px
  border-radius: 50%
  flex-shrink: 0
  border: 1px solid var(--ss-line-strong)

.name.me
  color: var(--ss-accent)
  font-weight: 600

.empty
  color: var(--ss-fg-faint)
</style>
