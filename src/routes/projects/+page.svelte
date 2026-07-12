<script lang="ts">
  import { Container, Heading } from "dssoca";
  import Skill from "$lib/components/Skill.svelte";
  import ProjectCard from "$lib/components/ProjectCard.svelte";

  import { icons } from "$lib/data/skills";
  import { projects } from "$lib/data/projects";
  import { m } from "$lib/paraglide/messages";
</script>

<Container page>
  <section class="projects">
    <Heading>Projects</Heading>
    <div class="projects-grid">
      {#each projects as project (project.name)}
        <ProjectCard {...project} />
      {/each}
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
  grid-gap: 20px

.grid-icons
  margin-top: 15px
  display: grid
  grid-gap: 20px

</style>
