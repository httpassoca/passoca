<script lang="ts">
  import { formatDate } from "$lib/helpers/formatDate";
  import type { Post } from "$lib/posts";
  import Icon from "svelte-hero-icons/Icon.svelte";
  import { Tag } from "svelte-hero-icons";

  export let post: Post;
  const headerStyle = `background-image: url(/blog/${post.slug}.webp)`;
</script>

<a class="post mt-8 sm:mt-0" href={`/blog/${post.slug}`}>
  <div class="header" style={`${headerStyle}`}>
    <span>{formatDate(post.date)}</span>
  </div>
  <div class="body">
    <h2 class="font-boston-semibold">
      {post.title}
    </h2>
    <div class="flex items-center gap-1">
      <Icon src={Tag} size="16" solid class="rotate-90" />
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
  cursor: pointer
  position: relative
  display: flex
  flex-direction: column
  height: 200px
  background: var(--app-color-primary)
  border-radius: .3em
  filter: drop-shadow(0px 0px 3px rgba(0,0,0,.3))
  > div
    padding: 8px
  .header
    display: grid
    border-radius: .3em .3em 0 0
    place-items: flex-end
    height: 140px
    background-size: cover
    background-position: center
    background-repeat: no-repeat
    color: white
    font-size: .8rem
    filter: drop-shadow(0px 0px 3px black)
    span
      background-color: #000000cc
      padding: 2px 6px
      border-radius: 4px
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
    color: var(--app-color-contrast-text)

</style>
