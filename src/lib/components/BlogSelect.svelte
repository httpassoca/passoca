<script lang="ts">
  import { personalPosts } from "$lib/stores/blog.store";

  const goProfessional = () => {
    $personalPosts = false;
  };
  const goPersonal = () => {
    $personalPosts = true;
  };
</script>

<div class="flex mx-auto">
  <button on:click={goProfessional} class:active={!$personalPosts}
    >Professional</button
  >
  <button on:click={goPersonal} class:active={$personalPosts}>Personal</button>
</div>

<style lang="sass">
.active
  color: lime
</style>
