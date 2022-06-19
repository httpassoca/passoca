<script lang="ts">
  import Icon from "svelte-hero-icons/Icon.svelte";
  import { ChevronDown } from "svelte-hero-icons";

  export let title: string = "";
  let open = false;
</script>

<div class="card bg-gray-800" on:click={() => (open = !open)}>
  <div class="header">
    <span>
      {title}
    </span>
    <div>
      <Icon src={ChevronDown} size="20" class={open && "rotate-180"} />
    </div>
  </div>
  <div class="content" class:active={open}>
    <div>
      <slot />
    </div>
  </div>
</div>

<style lang="sass">
.card
  background-color: #1e1e1e
  margin-bottom: 8px
  padding: 10px 18px
  border-radius: 6px
  cursor: pointer
  .header
    display: flex
    justify-content: space-between
    align-items: center
    width: 100%
    span
      font-size: 18px
      color: #838383
  .content
    margin-top: 8px
    font-size: 16px
    max-height: 0px
    overflow: hidden
    transition: max-height 1s ease
    &.active
      max-height: 100vh

</style>
