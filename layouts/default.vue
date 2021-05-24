<template>
  <div class="container mx-auto bg-backcolor dark:bg-darkColor">
    <VueToggles
      v-model="darkMode"
      height="30"
      width="70"
      dot-color="#100f10"
      checked-text="Dark"
      unchecked-text="Light"
      checked-bg="#66ef73"
      unchecked-bg="white"
      checked-color="black"
      unchecked-color="black"
      font-size="14"
      @click="changeTheme"
    />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueToggles from 'vue-toggles/dist/vue-toggles.ssr'
import 'vue-toggles/dist/vue-toggles.ssr.css'

Vue.component('VueToggles', VueToggles)

export default Vue.extend({
  name: 'Default',
  data () {
    return {
      darkMode: true
    }
  },
  methods: {
    changeTheme () {
      this.darkMode = !this.darkMode
      this.$colorMode.preference = this.darkMode ? 'dark-mode' : 'light'
    }
  }
})
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  outline: none;
}
</style>
