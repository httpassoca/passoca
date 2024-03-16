<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Post from "$lib/components/Post.svelte";
  import posts from "$lib/posts";
</script>

<Content page>
  <Title>Posts</Title>
  <div class="flex flex-col gap-3 mb-4">
    {#each posts as post, i (post.title)}
      {#if i === 0}
        {post.date.substring(0, 4)}
      {/if}
      {#if i && post.date.substring(0, 4) !== posts[i - 1].date.substring(0, 4)}
        {post.date.substring(0, 4)}
      {/if}
      <Post {post} />
    {/each}
  </div>
</Content>
