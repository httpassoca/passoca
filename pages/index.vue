<template lang="pug">
Content(classe="flex-col md:flex-row items-center justify-center md:justify-between")
  .info
    h6 Hi, I'm
    h1.font-boston Rafael Passoca
    h2.font-boston And I code.
    p As a Frontend Engineer, I believe that appearence and praticy are the best influences to the user. 
    p For me, <b>it is that matters. And I love to make it happen.</b>
    p Currently, I'm working at <a href="https://jmvtechnology.com/"> JMV Technology </a> with <b> Nochalks</b>, a distance education project. 
  img.profile-pic(src="https://avatars.githubusercontent.com/u/49541181?v=4" alt="me")
</template>

<style lang="sass" scoped>
.profile-pic
  @apply rounded-full m-4
  width: 300px
  height: 300px
.info
  img
    height: 56px
    margin-right: 20px
h1
  font-size: clamp(35px, 8vw, 70px)
h2
  font-size: 2rem
  font-weight: 200
  margin-bottom: .8rem
a
  text-decoration: none
  font-weight: 600
  position: relative
  &:before
    content: ''
    background-color: rgba(102, 239, 115, 0.75)
    width: 100%
    position: absolute
    bottom: .5px
    height: 1px
    transition: all .35s
  &:hover
    &:before
      background-color: rgb(102, 239, 115)
</style>
