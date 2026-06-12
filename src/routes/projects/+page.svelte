<script lang="ts">
  import { Container, Heading } from "dssoca";
  import Skill from "$lib/components/Skill.svelte";
  import ProjectCard from "$lib/components/ProjectCard.svelte";

  import { icons } from "$lib/data/skills";
  import { m } from "$lib/paraglide/messages";
</script>

<Container page>
  <section class="projects">
    <Heading>Projects</Heading>
    <div class="projects-grid">
      <ProjectCard
        name="Bloodborne Sudoku"
        description="A Bloodborne-themed Sudoku with a custom UI and game feel — built to be playable and polished on mobile. AI btw."
        features={[
          "Multiple difficulties + new puzzle generation",
          "Notes/pencil marks + error highlighting",
          "Keyboard support (desktop) + touch-first controls (mobile)",
          "Bloodborne-inspired theme, typography and sound design",
          "Multiplayer coop and duel modes",
        ]}
        imageSrc="/imgs/projects/bloodborne-sudoku.gif"
        imageAlt="Bloodborne Sudoku gameplay screenshot"
        githubUrl="https://github.com/httpassoca/bloodborne-sudoku"
        websiteUrl="https://sudoku.passoca.dev"
      />
    </div>
  </section>

  <Heading>{m.skills_title()}</Heading>
  <div class="grid-icons md:grid-cols-4 grid-cols-2">
    {#each icons as skill (skill.name)}
      <Skill {skill} />
    {/each}
  </div>
</Container>

<style lang="sass">
.projects
  margin-bottom: 26px

.projects-grid
  margin-top: 15px
  display: grid
  grid-template-columns: 1fr

.grid-icons
  margin-top: 15px
  display: grid
  grid-gap: 20px

</style>
