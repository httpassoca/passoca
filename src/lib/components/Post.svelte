<script lang="ts">
  import { formatDate } from "$lib/helpers/formatDate";
  import type { Post } from "$lib/posts";

  export let post: Post;
</script>

<a class="post" href={`/blog/${post.slug}`}>
  <div class="body">
    <header class="flex justify-between">
      <h2 class="font-boston-semibold">
        {post.title}
      </h2>
      <span>{formatDate(post.date)}</span>
    </header>
    <div class="flex items-center gap-1">
      <ul class="tags">
        {#each post.tags as tag}
          <li>{tag}</li>
        {/each}
      </ul>
    </div>
  </div>
</a>

<style lang="sass">
.post
  background-color: var(--app-color-lighter-background)
  padding: 10px 18px
  border-radius: 6px
  font-size: 18px
  color: var(--app-color-text)

  cursor: pointer
  position: relative
  display: flex
  flex-direction: column
  filter: drop-shadow(0px 0px 3px rgba(0,0,0,.3))
  h2
    transition: color .25s ease-in
  &:hover
    h2
      color: var(--app-color-shine-text)
  > div
    padding: 8px
  .tags
    display: flex
    gap: 6px
    li
      font-size: .7rem
      font-family: 'Caskaydia Cove'
      padding: 2px 0
      text-transform: lowercase
      + li:before
        content: '• '
  .body
    font-size: .875rem

</style>
