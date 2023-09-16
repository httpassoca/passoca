<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Post from "$lib/components/Post.svelte";
  import posts from "$lib/posts";
</script>

<Content page>
  <Title>Posts</Title>
  <div class="flex flex-col gap-3">
    {#each posts as post (post.title)}
      <Post {post} />
    {/each}
  </div>
</Content>
