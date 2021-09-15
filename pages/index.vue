<template lang="pug">
Content(classe="justify-between")
  .info
    .header
      img(src="/logo.svg" alt="logo" class="logo")
      h1.font-boston Rafael Passoca
    h2.mt-2 Frontend Engineer
  img.profile-pic(src="https://avatars.githubusercontent.com/u/49541181?v=4" alt="me")
</template>

<style lang="sass" scoped>
.profile-pic
  @apply rounded-full m-4
  width: 300px
  height: 300px
.info
  .header
    display: flex
    flex-grow: 1
  img
    height: 56px
    margin-right: 20px
h1
  font-size: 2.5rem
Content
  width: 100%
</style>
