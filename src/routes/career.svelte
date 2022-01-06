<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  import Experience, { experience } from "$lib/components/Experience.svelte";

  const jmvExperience: experience = {
    name: "JMV Technology",
    icon: "jmv",
    site: "jmvtechnology.com",
    time: "Apr 2020 - today",
    link: "https://jmvtechnology.com/",
  };
  const spiryExperience: experience = {
    name: "Spiry Capital",
    icon: "spiry",
    color: "white",
    whiteColor: "black",
    site: "spiry.ro",
    time: "Aug 2020 - Apr 2021 (8 mos)",
    link: "https://spiry.ro/",
  };
</script>

<Content page>
  <Title>Experiences</Title>
  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
    <Experience experience={jmvExperience}>
      <li>
        Get knowledge of git control with <span class="font-mono">git-flow</span
        >
      </li>
      <li>
        Developing components for
        <Link to="https://nochalks.com/">Nochalks</Link>
        using <b>Vue 2</b> and <b>Vuetify</b>
      </li>
      <li>
        Learned <b>TDD</b> with <span class="font-mono">vue-test-utils</span>
      </li>
      <li>Created Hub 2, a internal project with <b>Vue</b> and <b>TS</b></li>
    </Experience>
    <Experience experience={spiryExperience}>
      <li>
        Developed frontend of <Link to="https://koinzaar.com/">Koinzaar</Link> (Next.js,
        React, Styled Components)
      </li>
      <li>Developed internal projects using React</li>
    </Experience>
  </div>
</Content>
