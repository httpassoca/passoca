<script>
  import SVG from "svelte-inline-svg";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Button from "$lib/components/Base/AppButton.svelte";
  import { theme } from "$lib/stores/theme.store";
  let y;
  function goToSkills() {
    y = window.innerHeight * 0.8 - 85;
  }
</script>

<svelte:window bind:scrollY={y} />
<Content page class="flex md:flex-row sm:justify-center vh-full">
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
    <p class="text-base">
      If you just want my resume
      <a target="_blank" href="/resume.pdf" title="">click here</a>
    </p>
    <div class="flex mt-4 justify-center">
      <Button on:click={goToSkills}>
        See more
        <SVG
          src="/icons/arrow_down.svg"
          width="16"
          fill={$theme === "coffee" ? "#f9dec9" : ""}
        />
      </Button>
    </div>
  </div>
</Content>

<style lang="sass">
  h1
    font-size: clamp(36px, 8vw, 54px)
  h2
    font-size: clamp(24px, 6vw, 48px)
    font-weight: 200
    margin-bottom: .8rem
  a
    border-bottom: 1px solid var(--color-accent)
</style>
