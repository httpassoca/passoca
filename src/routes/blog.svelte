<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Post from "$lib/components/Post.svelte";
  import posts from "$lib/posts";
</script>

<Content page>
  <Title>Posts</Title>
  <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
    {#each posts as post (post.title)}
      <Post {post} />
    {/each}
  </div>
</Content>
