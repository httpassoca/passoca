<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Experience from "$lib/components/Experience.svelte";

  import { ctw, jmv, senai, spiry, uemg } from "$lib/data/experiences";
</script>

<Content page>
  <Title>Work</Title>
  <div class="my-6">
    <Experience experience={ctw}>
      <li>
        Designed and built infrastructure for an Angular microfrontend
        application within a monorepo, utilizing micro-deployments.
      </li>
      <li>Maintained 4 internal projects including another design system.</li>
      <li>
        Developed and maintained a Frontend Standards Guidance for BMW teams.
      </li>
      <li>
        Created an application to collect package usage statistics, including
        the migration of old data.
      </li>
      <li>Created well-written documentation for the products.</li>
      <li>
        <b>Tools used:</b> Jira, Bitbucket, Confluence, Windows, WSL, Docker
      </li>
      <li>
        <b>Tech stack:</b> Angular 8-17, React, Jasmine, Java (Spring / Quarkus),
        PostgreSQL, Jenkins, Kubernetes, Terraform, Ansible, Azure, NGINX
      </li>
    </Experience>
    <Experience experience={jmv}>
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
    <Experience experience={spiry}>
      <li>
        Developed frontend of <Link to="https://koinzaar.com/">Koinzaar</Link>
      </li>
      <li><b>Tech stack:</b> React, Next.js, PostgreSQL</li>
    </Experience>
  </div>
  <Title>Education</Title>
  <div class="my-6">
    <Experience experience={senai}>
      <li>
        Learned Programming logic with:
        <ul>
          <li>C++, C#, SQL, HTML CSS, JS JQuery and Java</li>
        </ul>
      </li>
    </Experience>
    <Experience experience={uemg}>
      <li>Computer Engineering</li>
      <li>Learn philosophy</li>
      <li>Realize that the university just was good at the end of 3 years</li>
      <li>Quit and focused on other jobs</li>
    </Experience>
  </div>
</Content>
