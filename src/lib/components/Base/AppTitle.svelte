<script>
  export let centered = false;
  export let line = true;
</script>

<h1 class:centered>
  <span class:line>
    <slot />
  </span>
</h1>

<style lang="scss">
  // dssoca display heading (theme.css `.hs-display` recipe, via --ss-* tokens)
  h1 {
    position: relative;
    font-family: var(--ss-font-display);
    font-style: normal;
    font-weight: 400;
    font-size: var(--ss-size-display);
    line-height: 1.05;
    letter-spacing: -0.015em;
    margin: 0 0 var(--ss-s-4) 0;
    color: var(--ss-fg);
    z-index: 0;
    text-shadow: 3px 3px var(--ss-bg);

    &.centered {
      text-align: center;
    }

    span {
      position: relative;
      &.line::before {
        content: "";
        position: absolute;
        left: -2%;
        right: -8%;
        top: 70%;
        height: 20%;
        z-index: -1;
        background: var(--ss-primary);
        opacity: 0.9;
      }
    }
  }
</style>
