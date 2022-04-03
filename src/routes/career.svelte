<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  import Experience, { experience } from "$lib/components/Experience.svelte";

  const ctwExperience: experience = {
    name: "Critical Techworks",
    image: "ctw",
    site: "criticaltechworks.com",
    time: "since Feb 2022",
    link: "https://www.criticaltechworks.com/",
  };
  const jmvExperience: experience = {
    name: "JMV Technology",
    icon: "jmv",
    site: "jmvtechnology.com",
    time: "Apr 2020 - Jan 2022",
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
  const senaiExperience: experience = {
    name: "SENAI",
    icon: "senai",
    color: "red",
    site: "senaimg.com.br",
    time: "Fev 2017 - Aug 2018",
    link: "https://www.senaimg.com.br/",
  };
  const uemgExperience: experience = {
    name: "UEMG",
    image: "uemg",
    site: "uemg.br",
    time: "Fev 2020 - Oct 2020",
    link: "https://www.uemg.br/",
  };
</script>

<Content page>
  <Title animated>Work</Title>
  <div class="my-6">
    <Experience experience={ctwExperience}>
      <li>Currently learning Angular and JAVA Spring</li>
      <li>Programming on Windows 🧠</li>
    </Experience>
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
  <Title animated>Education</Title>
  <div class="my-6">
    <Experience experience={senaiExperience}>
      <li>
        Learned Progamming logic with:
        <ul>
          <li>C++</li>
          <li>C#</li>
          <li>SQL</li>
          <li>HTML CSS</li>
          <li>JS JQuery</li>
          <li>Java (android studio)</li>
        </ul>
      </li>
    </Experience>
    <Experience experience={uemgExperience}>
      <li>Learn philosophy</li>
      <li>Realize that the university just was good at the end of 3 years</li>
      <li>So I quit and focused on other jobs</li>
    </Experience>
  </div>
</Content>
