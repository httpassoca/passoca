<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Skill from "$lib/components/Skill.svelte";

  import { icons } from "$lib/data/skills";
  import { m } from "$lib/paraglide/messages";
</script>

<Content page>
  <Title>{m.skills_title()}</Title>
  <div class="grid-icons md:grid-cols-4 grid-cols-2">
    {#each icons as skill (skill.name)}
      <Skill {skill} />
    {/each}
  </div>
</Content>

<style lang="sass">
.grid-icons
  margin-top: 15px
  display: grid
  grid-gap: 20px

</style>
