<script lang="ts">
  import { personalPosts } from "$lib/stores/blog.store";
</script>

<div class="flex justify-center gap-2">
  <button
    on:click={() => ($personalPosts = false)}
    class:active={!$personalPosts}
  >
    professional
  </button>
  <button
    on:click={() => ($personalPosts = true)}
    class:active={$personalPosts}
  >
    personal
  </button>
</div>

<style lang="sass">
button
  padding: 5px 20px
  font-style: italic
  border-bottom: 1px solid transparent
  transition: border-bottom .3s ease, transform .3s ease
  &.active
    border-bottom: 1px solid var(--app-color-primary)
  &:not(.active):hover
    transform: translateY(-3px)
</style>
