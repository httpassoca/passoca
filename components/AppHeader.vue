<template lang="pug">
  header(class="header" :class="{visible: !value}")
    img(src="/logo.svg" alt="logo" class="logo")
    span(class="name font-boston") Passoca

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppHeader',
  props: {
    value: Boolean
  }
})
</script>

<style lang="sass" scoped>
header
  @apply w-full flex py-4 bg-background dark:bg-darkBackground z-10
  position: fixed
  height: 80px
  opacity: 0
  transform: translateY(-70%)
  transition: all .35s cubic-bezier(0.215,0.61,0.355,1)
  &.visible
    opacity: 1
    transform: none
  .name
    font-size: 2rem
    @apply ml-4
  .logo
    width: 48px
    &:hover
      ~ .name
        opacity: 1
</style>
