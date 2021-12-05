<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import Content from "$lib/AppContent.svelte";
  import Profile from "$lib/Sections/SectionProfile.svelte";
  import Button from "$lib/AppButton.svelte";
  import Skills from "$lib/Sections/SectionSkills.svelte";
</script>

<svelte:head>
  <title>Passoca</title>
</svelte:head>

<Profile />
<Skills />
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
