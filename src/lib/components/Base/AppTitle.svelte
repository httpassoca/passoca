<script>
  export let animated = false;
  export let centered = false;
</script>

<div class:animated class:centered>
  <h1>
    <slot />
  </h1>
</div>

<style lang="scss">
  // Colors
  $c: var(--app-color-title-1);
  $c2: var(--app-color-title-2);
  $c3: var(--app-color-title-3);
  $c4: var(--app-color-title-4);
  $c5: var(--app-color-title-5);

  @function makelongshadow($c, $c2, $c3, $c4, $c5) {
    $val: 0px 0px $c;
    @for $i from 1 through 2 {
      $val: #{$val}, -#{$i}px #{$i}px #{$c};
    }
    @for $i from 3 through 4 {
      $val: #{$val}, -#{$i}px #{$i}px #{$c2};
    }
    @for $i from 5 through 6 {
      $val: #{$val}, -#{$i}px #{$i}px #{$c3};
    }
    @for $i from 7 through 8 {
      $val: #{$val}, -#{$i}px #{$i}px #{$c4};
    }
    @for $i from 9 through 10 {
      $val: #{$val}, -#{$i}px #{$i}px #{$c5};
    }
    @return $val;
  }

  @keyframes animateShadow {
    0% {
      text-shadow: makelongshadow($c, $c2, $c3, $c4, $c5);
    }
    20% {
      text-shadow: makelongshadow($c2, $c3, $c4, $c5, $c);
    }
    40% {
      text-shadow: makelongshadow($c3, $c4, $c5, $c, $c2);
    }
    60% {
      text-shadow: makelongshadow($c4, $c5, $c, $c2, $c3);
    }
    80% {
      text-shadow: makelongshadow($c5, $c, $c2, $c3, $c4);
    }
    100% {
      text-shadow: makelongshadow($c, $c2, $c3, $c4, $c5);
    }
  }

  div {
    position: relative;
    font-family: "Boston Black It";
    color: #edeee9;
    font-size: 1.675rem;
    margin-bottom: 1rem;

    &.animated {
      font-size: 2rem;
      left: -12px;
      padding: 12px;
      overflow: hidden;
      line-height: 0.8;
      text-shadow: makelongshadow($c, $c2, $c3, $c4, $c5);
      animation-name: animateShadow;
      animation-duration: 0.9s;
      animation-iteration-count: infinite;
      h1 {
        color: var(--app-color-title);
      }
    }

    &.centered {
      text-align: center;
    }

    h1 {
      color: var(--app-color-text);
    }
  }
</style>
