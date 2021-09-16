<template lang="pug">
Content(classe="flex-col md:flex-row items-center justify-center md:justify-between")
  .info
    h6 Hi, I'm
    h1.font-boston Rafael Passoca
    h2.font-boston And I code.
    p(v-html="info")
  img.profile-pic(src="https://avatars.githubusercontent.com/u/49541181?v=4" alt="me")
</template>

<script>
export default {
  data () {
    return {
      info: `
          As a Frontend Engineer, I believe that appearence and praticy are the best influences to the user. For me,
    <i> it is that matters. </i>
    Currently, I'm working at
    <b> JMV Technology </b>
    , with
    <b> Nochalks </b>
    , a distance education project.
    `
    }
  }
}
</script>
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
Content
  width: 100%
</style>
