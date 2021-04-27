<template lang="pug">
  div(class="w-full h-screen flex flex-col items-center justify-center")
    img(src="/logo.svg" alt="logo" class="logo")
    h1 Passoca
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="sass" scoped>
.logo
  transform: scale(.6)
h1
  font-family: 'Boston Black It'
  font-size: 2.5rem
@font-face
  font-family: 'Boston Black It'
  font-style: normal
  font-display: swap
  src: url('~assets/fonts/Boston-BlackIt.otf')
</style>
