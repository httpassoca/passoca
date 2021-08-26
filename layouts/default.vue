<template>
  <div id="canvas">
    <div v-scroll="onScroll" class="container-fluid bg-background dark:bg-darkBackground dark:text-darkText">
      <div class="container mx-auto main-content relative min-h-screen">
        <AppHeader v-model="onTop" />
        <Nuxt />
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { scroll } from '@/plugins/directives'

export default Vue.extend({
  directives: { scroll },
  data () {
    return {
      onTop: true
    }
  },
  methods: {
    onScroll () {
      if (window.scrollY === 0) { this.onTop = true } else { this.onTop = false }
    }
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
  position: absolute
  top: 0
  left: 0
  z-index: 0

</style>
