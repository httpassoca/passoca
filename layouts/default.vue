<template>
  <div class="bg-background dark:bg-darkBackground dark:text-darkText">
    <div id="canvas">
      <ChangeTheme />
      <Nuxt class="min-h-screen" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mounted () {
    const radar = require('@/canvas.js')
    const P5 = require('p5')
    const dieEslint = new P5(radar.main)
  }
})
</script>

<style lang="sass">

@font-face
  font-family: 'Boston Black It'
  font-style: normal
  font-display: swap
  src: url('~assets/fonts/Boston-BlackIt.otf')

html
  font-family: 'Noto Sans JP', 'Source Sans Pro', sans-serif
  font-size: 16px
  -ms-text-size-adjust: 100%
  -webkit-text-size-adjust: 100%
  -moz-osx-font-smoothing: grayscale
  -webkit-font-smoothing: antialiased

*,
*::before,
*::after
  box-sizing: border-box
  margin: 0
  padding: 0
  outline: none
  transition: all .25s cubic-bezier(0.215,0.61,0.355,1)

.main
  min-height: calc(100vh - 400px)

.font-boston
  font-family: 'Boston Black It'

canvas
  position: fixed
  top: 0
  left: 0
  z-index: 0

</style>
