<template lang="pug">
  header
    img(src="/logo.svg" alt="logo" class="logo")
    ChangeTheme
</template>

<style lang="sass" scoped>
section
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
header
  @apply container w-full flex justify-between py-4 absolute left-1/2
  transform: translateX(-50%)
img
  height: 45px
</style>
