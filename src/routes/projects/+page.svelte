<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
</script>

<Content page>
  <Title>Projects</Title>
  <div class="grid-icons md:grid-cols-4 grid-cols-2">projects</div>
</Content>

<style lang="sass">
.grid-icons
  margin-top: 15px
  display: grid
  grid-gap: 20px

</style>
