<script lang="ts" context="module">
  export type blog = {
    name: string;
    tags: string[];
    link?: string;
    img?: string;
    date: string;
  };
</script>

<script lang="ts">
  export let blog: blog;
  const headerStyle =
    "background: linear-gradient(0deg, rgba(var(--app-color-primary-rgb),.4) -20%, rgba(0,0,0,0.8) 110%)";
</script>

<div class="blog mt-8 sm:mt-0">
  <div class="header" style={`${headerStyle}, url('${blog.img}')`}>
    <div>
      <ul class="tags">
        {#each blog.tags as tag}
          <li>{tag}</li>
        {/each}
      </ul>
      <span>{blog.date}</span>
    </div>
  </div>
  <div class="body">
    <h2 class="font-boston-semibold">
      {blog.name}
    </h2>
  </div>
</div>

<style lang="sass">
.blog
  cursor: pointer
  position: relative
  display: flex
  flex-direction: column
  height: 200px
  background: var(--app-color-primary)
  clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)
  > div
    padding: 8px
  .header
    display: flex
    flex-direction: column
    justify-content: flex-end
    height: 140px
    width: 100%
    color: white
    > div
      width: 100%
      display: flex
      justify-content: space-between
      font-size: .8rem
      filter: drop-shadow(0px 0px 2px black)
    ul
      display: flex
      gap: 10px
    li
      font-size: .7rem
    li, span
      background-color: #00000099
      padding: 2px 6px
      border-radius: 4px
  .body
    font-size: .875rem
    color: var(--app-color-contrast-text)

</style>
