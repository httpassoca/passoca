<script>
  import Content from "$lib/components/Base/AppContent.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
</script>

<Content page>
  <div class="info">
    <h1 class="font-boston">Hi, I'm Rafael Passoca.</h1>
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
      <a target="_blank" href="/resume.pdf" title="resume">click here</a>
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
