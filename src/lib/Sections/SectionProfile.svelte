<script>
  import SVG from "svelte-inline-svg";
  import Content from "$lib/AppContent.svelte";
  import Button from "$lib/AppButton.svelte";
  let y;
  function goToSkills() {
    y = window.innerHeight;
  }
</script>

<svelte:window bind:scrollY={y} />
<Content page class="flex md:flex-row sm:items-center sm:justify-center">
  <div class="info">
    <h1 class="font-boston">Hi, I'm Rafael Passoca.</h1>
    <h2 class="font-boston">And I code.</h2>
    <p>
      As a Frontend Engineer, I believe that appearence and praticy are the best
      influences to the user.
    </p>
    <p>
      For me,
      <b>it is what matters. And I love to make it happen.</b>
    </p>
    <div class="flex mt-4 justify-center">
      <Button on:click={goToSkills}>
        See more
        <SVG src="/icons/arrow_down.svg" width="16" height="16" />
      </Button>
    </div>

    <!-- <p>
      Currently, I'm working at <a
        href="https://jmvtechnology.com/"
        target="_blank"
      >
        JMV Technology
      </a>
      in <b> Nochalks</b>, a distance education project.
    </p> -->
  </div>
</Content>

<style lang="sass">
  .profile-pic
    @apply rounded-full m-4
    width: 260px
    height: 260px
    &.phone
      margin: 8px
      width: 120px
      height: 120px
  h1
    font-size: clamp(36px, 8vw, 54px)
  h2
    font-size: clamp(24px, 6vw, 48px)
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
