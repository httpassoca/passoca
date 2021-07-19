<template lang="pug">
  header(class="header")
    img(src="/logo.svg" alt="logo" class="logo")
    span(class="name") Passoca
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppHeader'
})
</script>

<style lang="sass" scoped>
header
  @apply flex py-4
  .name
    opacity: 0
  .logo
    width: 48px
    &:hover
      ~ .name
        opacity: 1
</style>
