<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Skill from "$lib/components/Skill.svelte";
  import ProjectCard from "$lib/components/ProjectCard.svelte";

  import { icons } from "$lib/data/skills";
  import { m } from "$lib/paraglide/messages";
</script>

<Content page>
  <section class="projects">
    <Title>Projects</Title>
    <div class="projects-grid">
      <ProjectCard
        name="Bloodborne Sudoku"
        description="A Bloodborne-themed Sudoku with a custom UI and a bit of hunter vibes."
        githubUrl="https://github.com/httpassoca/bloodborne-sudoku"
        websiteUrl="https://sudoku.passoca.dev"
      />
    </div>
  </section>

  <Title>{m.skills_title()}</Title>
  <div class="grid-icons md:grid-cols-4 grid-cols-2">
    {#each icons as skill (skill.name)}
      <Skill {skill} />
    {/each}
  </div>
</Content>

<style lang="sass">
.projects
  margin-bottom: 26px

.projects-grid
  margin-top: 15px
  display: grid
  grid-template-columns: 1fr

  @media (min-width: 768px)
    grid-template-columns: repeat(2, 1fr)
    gap: 16px

.grid-icons
  margin-top: 15px
  display: grid
  grid-gap: 20px

</style>
