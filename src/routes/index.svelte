<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import Profile from "$lib/Sections/SectionProfile.svelte";
  import Skills from "$lib/Sections/SectionSkills.svelte";
  import Experience from "$lib/Sections/SectionExperience.svelte";
</script>

<svelte:head>
  <title>Passoca</title>
</svelte:head>

<Profile />
<Skills />
<Experience />
<!-- <Content page>
  <div class="info">
    <Button>ASD</Button>
  </div>
</Content>
<Content
  page
  classe="flex-col md:flex-row items-center justify-center md:justify-between"
>
  <div class="info">Projects</div>
</Content>
<Content
  page
  classe="flex-col md:flex-row items-center justify-center md:justify-between"
>
  <div class="info">Experience</div>
</Content> -->
