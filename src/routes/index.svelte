<script>
  import Content from "$lib/components/Base/AppContent.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
</script>

<Content page>
  <div class="info">
    <h1 class="font-boston mb-2">Hi, I'm Rafael Passoca.</h1>
    <p>
      As a Frontend Engineer, I believe that appearence and practicity are the best
      influences to the user. <b
        >This is what matters. And I love to make it happen.</b
      >
    </p>
    <p class="text-base">
      If you just want my resumé
      <a target="_blank" href="https://www.notion.so/passoca/Curriculum-Vitae-Rafael-Freitas-f4e9a131885846cabdd6c0ab658f476d?pvs=4" title="resume">click here</a>
    </p>
    <div class="flex mt-4 justify-center">
      <Link to="/about" button blank={false}>More about me</Link>
    </div>
  </div>
</Content>

<style lang="sass">
  h1
    font-size: clamp(36px, 8vw, 54px)
  a
    border-bottom: 1px solid var(--app-color-primary)
</style>
