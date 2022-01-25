<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Post from "$lib/components/Post.svelte";
  import { personalPosts } from "$lib/stores/blog.store";
  import BlogSelect from "$lib/components/BlogSelect.svelte";
  import posts from "$lib/posts";
</script>

<Content page>
  <BlogSelect />
  <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
    {#each posts as post (post.title)}
      {#if post.personal && $personalPosts}
        <Post {post} />
      {:else if !post.personal && !$personalPosts}
        <Post {post} />
      {/if}
    {/each}
  </div>
</Content>
