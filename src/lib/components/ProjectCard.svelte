<script lang="ts">
  import SVG from "$lib/components/Base/AppSVG.svelte";

  export let name: string;
  export let description: string;
  export let githubUrl: string | undefined = undefined;
  export let websiteUrl: string | undefined = undefined;
</script>

<article class="card">
  <header>
    <h3>{name}</h3>
    <p>{description}</p>
  </header>

  <footer class="links">
    {#if websiteUrl}
      <a class="btn" href={websiteUrl} target="_blank" rel="noreferrer">
        <span>Website</span>
        <SVG
          name="external_link"
          width="14"
          height="14"
          fill="var(--app-color-text)"
        />
      </a>
    {/if}
    {#if githubUrl}
      <a class="btn" href={githubUrl} target="_blank" rel="noreferrer">
        <span>GitHub</span>
        <SVG name="github" width="16" height="16" fill="var(--app-color-text)" />
      </a>
    {/if}
  </footer>
</article>

<style lang="sass">
  article.card
    padding: 18px
    border-radius: 16px
    border: 1px solid rgba(255, 255, 255, 0.12)
    background: rgba(255, 255, 255, 0.04)

  header h3
    font-size: 16px
    line-height: 18px
    font-weight: 600

  header p
    margin-top: 8px
    opacity: 0.85
    font-size: 13px
    line-height: 18px

  footer.links
    margin-top: 14px
    display: flex
    gap: 10px
    flex-wrap: wrap

  a.btn
    display: inline-flex
    align-items: center
    gap: 8px
    padding: 8px 10px
    border-radius: 12px
    border: 1px solid rgba(255, 255, 255, 0.12)
    opacity: 0.9

  a.btn:hover
    opacity: 1
    border-color: rgba(255, 255, 255, 0.22)
    background: rgba(255, 255, 255, 0.04)

  a.btn span
    font-size: 12px
    line-height: 12px
</style>
