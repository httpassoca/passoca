<template lang="pug">
header
  img(src="/logo.svg" alt="logo" class="logo")
  .icons
    a(href="https://github.com/rafonel" target="_blank")
      GHIcon(class="dark:fill-black")
    a(href="https://linkedin.com/in/passoca" target="_blank")
      LinkedinIcon(class="dark:fill-black")
    ChangeTheme
</template>

<script lang="ts">
import Vue from 'vue'
import LinkedinIcon from '~/static/linkedin.svg?inline'
import GHIcon from '~/static/gh.svg?inline'

export default Vue.extend({
  components: {
    GHIcon,
    LinkedinIcon
  }
})
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

a > svg * {
  fill: black !important
}
@layer utilities {
  @variants dark {
    .fill-black * {
      fill: theme(colors.darkText) !important
    }
  }
}
</style>

<style lang="sass" scoped>
header
  @apply container w-full flex justify-between py-4 mx-auto relative
.icons
  @apply flex h-full items-center my-auto gap-2
  svg
    height: 23px
    width: 23px
  a
    line-height: 24px
    display: block
    position: relative
    margin-right: 14px
    &::after
      content: ''
      height: 4px
      width: 4px
      display: block
      position: absolute
      right: -14px
      border-left: 3px solid transparent
      border-right: 3px solid transparent
      border-bottom: 5px solid #66ef63
      top: 53%
      transform: translateY(-50%)
img
  height: 45px
</style>
