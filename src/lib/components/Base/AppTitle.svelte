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
  h1 {
    position: relative;
    font-family: "Boston Black It";
    font-size: 1.675rem;
    margin-bottom: 1rem;
    color: var(--app-color-text);
    z-index: 0;
    text-shadow: 3px 3px var(--app-color-background);

    &.centered {
      text-align: center;
    }

    span {
      position: relative;
      &.line::before {
        content: "";
        display: block;
        position: absolute;
        width: 110%;
        height: 20%;
        top: 70%;
        z-index: -1;
        background-color: var(--app-color-primary);
        opacity: 0.9;
        border-radius: 2px;
      }
    }
  }
</style>
