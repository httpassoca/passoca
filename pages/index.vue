<template lang="pug">
  section(class="profile")
    img(src="/logo.svg" alt="logo" class="logo")
    h1(class="font-boston") Passoca
    <AppMain/>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="sass" scoped>
.profile
  @apply w-full h-screen flex flex-col items-center justify-center
.logo
  transform: scale(.6)
h1
  font-size: 2.5rem
</style>
