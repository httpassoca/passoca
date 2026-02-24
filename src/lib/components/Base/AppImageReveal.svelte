<!-- NOTE: this component is not compiled as a custom element today. -->

<script lang="ts">
    export let src: string;
    let hovered = false;
    let offset = 0;

    function leave() {
        hovered = false
        offset = 0
    }

    function moveImg(e) {
        offset += e.movementX;
    }
</script>

<span
    class="text"
    role="button"
    tabindex="0"
    on:mouseenter={() => hovered = true}
    on:mouseleave={leave}
    on:mousemove={moveImg}
>
    <slot></slot>
    {#if hovered}
        <img {src} alt="special effect" style={`transform: translateX(${offset || 0}px);`} />
    {/if}
</span>



<style>
  .text {
    position: relative;
  }

  img {
    position: absolute;
    bottom: 50%;
    right: 0;
    width: 13rem; /* w-52 */
  }
</style>
