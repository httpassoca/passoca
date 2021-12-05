<div>
  <h1>
    <slot />
  </h1>
</div>

<style lang="scss">
  // #D92525 -- red
  // #F25C05 -- orange
  // #88A61B -- green
  // #0E3D59 -- blue
  // #572D8C -- purple
  // $c: #D92525;
  // $c2: #F25C05;
  // $c3: #88A61B;
  // $c4: #0E3D59;
  // $c5: #572D8C;

  // Grays
  $c: #021704aa;
  $c2: #07450daa;
  $c3: #0c7316aa;
  $c4: #11a21faa;
  $c5: #16d027aa;

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
    padding: 12px;
    overflow: hidden;
    line-height: 0.8;
    font-size: 2rem;
    font-family: "Boston Black It";
    color: #edeee9;
    text-shadow: makelongshadow($c, $c2, $c3, $c4, $c5);
    animation-name: animateShadow;
    animation-duration: 0.9s;
    animation-iteration-count: infinite;
  }
</style>
