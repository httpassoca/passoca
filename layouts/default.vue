<template>
  <div class="container-fluid bg-background dark:bg-darkBackground dark:text-darkText">
    <div class="container mx-auto main-content">
      <AppHeader />
      <Nuxt />
    </div>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: mapState(['darkMode']),
  beforeMount () {
    this.$colorMode.preference = this.darkMode ? 'dark-mode' : 'light'
  }
})
</script>

<style>
html {
  font-family: 'Noto Sans JP',
    'Source Sans Pro',
    sans-serif;
  font-size: 16px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  outline: none;
  transition: all .25s cubic-bezier(0.215,0.61,0.355,1);
}
.main {
  min-height: calc(100vh - 400px);
}
</style>
