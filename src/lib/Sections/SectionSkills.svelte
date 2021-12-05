<script lang="ts">
  import Content from "$lib/AppContent.svelte";
  import Title from "$lib/AppTitle.svelte";
  import Skill, { skill } from "$lib/Skill.svelte";

  const icons: skill[] = [
    {
      name: "Javascript",
      icon: "/icons/javascript.svg",
      color: "#F7DF1E",
      link: "https://www.javascript.com/",
    },
    {
      name: "Typescript",
      icon: "/icons/typescript.svg",
      color: "#3178C6",
      link: "https://www.typescriptlang.org/",
    },
    {
      name: "Vue.js",
      icon: "/icons/vue.svg",
      color: "#4FC08D",
      link: "https://vuejs.org/",
    },
    {
      name: "Nuxt.js",
      icon: "/icons/nuxt.svg",
      color: "#00DC82",
      link: "https://nuxtjs.org/",
    },
    {
      name: "Next.js",
      icon: "/icons/next.svg",
      color: "#FFF",
      whiteColor: "#000",
      link: "https://nextjs.org/",
    },
    {
      name: "React.js",
      icon: "/icons/react.svg",
      color: "#61DAFB",
      link: "https://reactjs.org/",
    },
    {
      name: "Jest.js",
      icon: "/icons/jest.svg",
      color: "#C21325",
      link: "https://jestjs.io/",
    },
    {
      name: "Svelte",
      icon: "/icons/svelte.svg",
      color: "#FF3E00",
      link: "https://svelte.dev/",
    },
    {
      name: "Tailwind CSS",
      icon: "/icons/tailwind.svg",
      color: "#06B6D4",
      link: "https://tailwindcss.com/",
    },
    {
      name: "GraphQL",
      icon: "/icons/graphql.svg",
      color: "#E10098",
      link: "https://graphql.org/",
    },
    {
      name: "Firebase",
      icon: "/icons/firebase.svg",
      color: "#FFCA28",
      link: "https://firebase.google.com/",
    },
    {
      name: "Socket.io",
      icon: "/icons/socketio.svg",
      color: "#fefefe",
      whiteColor: "#010101",
      link: "https://socket.io/",
    },
    {
      name: "PostgreSQL",
      icon: "/icons/postgresql.svg",
      color: "#4169E1",
      link: "https://www.postgresql.org/",
    },
    { name: "SQL", icon: "/icons/sql.svg", color: "#4479A1" },
    {
      name: "Photoshop",
      icon: "/icons/photoshop.svg",
      color: "#31A8FF",
      link: "https://www.adobe.com/br/products/photoshop.html",
    },
    {
      name: "Illustrator",
      icon: "/icons/illustrator.svg",
      color: "#FF9A00",
      link: "https://www.adobe.com/br/products/illustrator.html",
    },
  ];
</script>

<Content class="mb-8">
  <Title>Skills</Title>
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
