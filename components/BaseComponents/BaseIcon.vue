<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="name"
    role="presentation"
  >
    <title
      :id="name"
      lang="en"
    >{{ name }} icon</title>
    <g :fill="color">
      <slot />
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    color: {
      type: String,
      default: 'white'
    },
    name: {
      type: String,
      default: ''
    },
    height: {
      type: [Number, String],
      default: 24
    },
    width: {
      type: [Number, String],
      default: 24
    }
  }
})
</script>
