<script lang="ts">
  import Icon from "svelte-hero-icons/Icon.svelte";
  import { ChevronDown } from "svelte-hero-icons";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let title = "";
  export let id = "";
  let open = false;

  const extend = () => {
    open = !open;
    if (open) {
      return dispatch("open");
    }
  };
</script>

<div {id} class="card bg-gray-800">
  <div class="header" on:click={extend}>
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
  font-size: 18px

  span
    transition: color .25s ease-in
  &:hover
    span
      color: var(--app-color-shine-text)
  .header
    display: flex
    justify-content: space-between
    align-items: center
    width: 100%
    cursor: pointer
    span
      color: var(--app-color-gray-text)
      margin-right: 10px
  .content
    margin-top: 0px
    max-height: 0px
    overflow: hidden
    transition: max-height .5s ease, margin-top .5s ease-in-out
    &.active
      margin-top: 8px
      max-height: 100vh

</style>
