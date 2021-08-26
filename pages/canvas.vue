<template>
  <div class="min-h-100" />
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted () {
    const radar = require('@/canvas.js')
    const P5 = require('p5')
    new P5(radar.main)
  }
})
</script>
