<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Blog, { blog } from "$lib/components/Blog.svelte";

  const blogs: blog[] = [
    {
      name: "My website",
      img: "/blog/any-theme-card.jpg",
      tags: ["svelte", "typescript", "blog"],
      date: "Dec 11, 2021",
    },
  ];
</script>

<Content page>
  <Title>My blog</Title>
  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
    {#each blogs as blog (blog.name)}
      <Blog {blog} />
    {/each}
  </div>
</Content>

<style lang="sass">


</style>
