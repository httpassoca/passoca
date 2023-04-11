<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  import Experience from "$lib/components/Experience.svelte";
  import type { experience } from "$lib/components/Experience.svelte";

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
      <li>Scrum methodology</li>
      <li>Tasks development alongside with PO and UX designers</li>
      <li>Continous feedback shared with team</li>
      <li>Maintained 4 internal projects including a design system</li>
      <li>Learned DevOps principles</li>
      <li>
        <b>Tools used:</b> Jira, Bitbucket, Confluence, Windows, WSL, Docker
      </li>
      <li>
        <b>Tech stack:</b> Angular 8-14, React, Jasmine, Java (Spring / Quarkus),
        PostgreSQL, Jenkins, Kubernetes, Terraform, Ansible, Azure, NGINX,
      </li>
    </Experience>
    <Experience experience={jmvExperience}>
      <li>
        Maintained a distance education platform management project (<Link
          to="https://nochalks.com/">Nochalks</Link
        >)
      </li>

      <li>Created an internal project to manage multiplatform social stream</li>
      <li>Learned TDD with Vue</li>
      <li><b>Tools used:</b> Gitlab, Linux and docker</li>
      <li>
        <b>Tech stack:</b> Vue 2, PHP (Laravel), Node.js, Websocket, Jest.js, PostgreSQL
      </li>
    </Experience>
    <Experience experience={spiryExperience}>
      <li>
        Developed frontend of <Link to="https://koinzaar.com/">Koinzaar</Link>
      </li>
      <li><b>Tech stack:</b> React, Next.js, PostgreSQL</li>
    </Experience>
  </div>
  <Title animated>Education</Title>
  <div class="my-6">
    <Experience experience={senaiExperience}>
      <li>
        Learned Programming logic with:
        <ul>
          <li>C++, C#, SQL, HTML CSS, JS JQuery and Java</li>
        </ul>
      </li>
    </Experience>
    <Experience experience={uemgExperience}>
      <li>Computer Engineering</li>
      <li>Learn philosophy</li>
      <li>Realize that the university just was good at the end of 3 years</li>
      <li>Quit and focused on other jobs</li>
    </Experience>
  </div>
</Content>
