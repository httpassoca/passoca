<template>
  <footer class="bg-gray dark:bg-darkGray">
    <div class="container mx-auto py-3 flex">
      <div @click="changeTheme">
        <v-icon
          :name="darkMode ? 'bi-cloud-sun' : 'io-cloudy-night-outline'"
          scale="2"
          class="text-darkGray dark:text-gray cursor-pointer"
        />
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
import VueToggles from 'vue-toggles/dist/vue-toggles.ssr'
import 'vue-toggles/dist/vue-toggles.ssr.css'

import OhVueIcon from 'oh-vue-icons'

import { BiCloudSun, IoCloudyNightOutline } from 'oh-vue-icons/icons'
OhVueIcon.add(BiCloudSun, IoCloudyNightOutline)

Vue.component('VIcon', OhVueIcon)
Vue.component('VueToggles', VueToggles)

export default Vue.extend({
  name: 'AppFooter',
  computed: {
    darkMode () { return this.$colorMode.preference === 'dark-mode' }
  },
  methods: {
    changeTheme (): void {
      this.$colorMode.preference = this.darkMode ? 'light' : 'dark-mode'
    }
  }
})
</script>

<style scoped lang="sass">
footer
  height: 400px
  width: 100%
</style>
