<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import Content from "$lib/Content.svelte";
</script>

<svelte:head>
  <title>Passoca</title>
</svelte:head>

<Content
  classe="flex-col md:flex-row items-center justify-center md:justify-between"
>
  <div class="info">
    <h1 class="font-boston">Hi, I'm Rafael Passoca</h1>
    <h2 class="font-boston">And I code.</h2>
    <p>
      As a Frontend Engineer, I believe that appearence and praticy are the best
      influences to the user.
    </p>
    <p>For me, <b>it is that matters. And I love to make it happen.</b></p>
    <p>
      Currently, I'm working at <a
        href="https://jmvtechnology.com/"
        target="_blank"
      >
        JMV Technology
      </a>
      with <b> Nochalks</b>, a distance education project.
    </p>
  </div>
  <img
    class="profile-pic"
    src="https://avatars.githubusercontent.com/u/49541181?v=4"
    alt="me"
  />
</Content>

<style lang="sass">
.profile-pic
  @apply rounded-full m-4
  width: 300px
  height: 300px
h1
  font-size: clamp(35px, 8vw, 70px)
h2
  font-size: 2rem
  font-weight: 200
  margin-bottom: .8rem
a
  text-decoration: none
  font-weight: 600
  position: relative
  &:before
    content: ''
    background-color: #10951c
    width: 100%
    position: absolute
    left: 0
    bottom: 1px
    height: 1px
    transition: all .35s cubic-bezier(0.215,0.61,0.355,1)
  &:hover
    &:before
      box-shadow: 0px -9.6px 18px rgb(102, 239, 115), 0px -26.4px 32.8px rgb(102, 239, 115), 0px -63.6px 65.2px rgb(102, 239, 115), 0px -211px 137px rgb(102, 239, 115)
      background-color: rgb(102, 239, 115)
      height: 2px
</style>
