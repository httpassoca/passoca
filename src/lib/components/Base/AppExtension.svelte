<script lang="ts">
  import Icon from "svelte-hero-icons/Icon.svelte";
  import { ChevronDown } from "svelte-hero-icons";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let title: string = "";
  let open = false;

  const extend = () => {
    open = !open;
    if (open) {
      return dispatch("open");
    }
  };
</script>

<div class="card bg-gray-800" on:click={extend}>
  <div class="header">
    <span>
      {title}
    </span>
    <div>
      <Icon src={ChevronDown} size="20" class={open && "rotate-180"} />
    </div>
  </div>
  <div class="content" class:active={open}>
    <slot />
  </div>
</div>

<style lang="sass">
.card
  background-color: var(--app-color-lighter-background)
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
    margin-top: 0px
    font-size: 16px
    max-height: 0px
    overflow: hidden
    transition: max-height 1s ease, margin-top 1s ease
    &.active
      margin-top: 8px
      max-height: 100vh

</style>
