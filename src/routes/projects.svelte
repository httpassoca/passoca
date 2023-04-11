<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Skill from "$lib/components/Skill.svelte";
  import type { skill } from "$lib/components/Skill.svelte";

  const icons: skill[] = [
    {
      name: "Javascript",
      icon: "javascript",
      color: "#F7DF1E",
      link: "https://www.javascript.com/",
    },
    {
      name: "Typescript",
      icon: "typescript",
      color: "#3178C6",
      link: "https://www.typescriptlang.org/",
    },
    {
      name: "Vue.js",
      icon: "vue",
      color: "#4FC08D",
      link: "https://vuejs.org/",
    },
    {
      name: "Nuxt.js",
      icon: "nuxt",
      color: "#00DC82",
      link: "https://nuxtjs.org/",
    },
    {
      name: "Next.js",
      icon: "next",
      color: "#FFF",
      whiteColor: "#000",
      link: "https://nextjs.org/",
    },
    {
      name: "React.js",
      icon: "react",
      color: "#61DAFB",
      link: "https://reactjs.org/",
    },
    {
      name: "Jest.js",
      icon: "jest",
      color: "#C21325",
      link: "https://jestjs.io/",
    },
    {
      name: "Svelte",
      icon: "svelte",
      color: "#FF3E00",
      link: "https://svelte.dev/",
    },
    {
      name: "Tailwind CSS",
      icon: "tailwind",
      color: "#06B6D4",
      link: "https://tailwindcss.com/",
    },
    {
      name: "GraphQL",
      icon: "graphql",
      color: "#E10098",
      link: "https://graphql.org/",
    },
    {
      name: "Firebase",
      icon: "firebase",
      color: "#FFCA28",
      link: "https://firebase.google.com/",
    },
    {
      name: "Socket.io",
      icon: "socketio",
      color: "#fefefe",
      whiteColor: "#010101",
      link: "https://socket.io/",
    },
    {
      name: "PostgreSQL",
      icon: "postgresql",
      color: "#4169E1",
      link: "https://www.postgresql.org/",
    },
    { name: "SQL", icon: "sql", color: "#4479A1" },
    {
      name: "Photoshop",
      icon: "photoshop",
      color: "#31A8FF",
      link: "https://www.adobe.com/br/products/photoshop.html",
    },
    {
      name: "Illustrator",
      icon: "illustrator",
      color: "#FF9A00",
      link: "https://www.adobe.com/br/products/illustrator.html",
    },
  ];
</script>

<Content page>
  <Title animated>Skills</Title>
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
