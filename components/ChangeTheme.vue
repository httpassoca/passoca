<template>
  <div @click="changeTheme">
    <v-icon
      :name="darkMode ? 'bi-cloud-sun' : 'io-cloudy-night-outline'"
      scale="2"
      class="text-darkGray dark:text-gray cursor-pointer"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import OhVueIcon from 'oh-vue-icons'

import { BiCloudSun, IoCloudyNightOutline } from 'oh-vue-icons/icons'
OhVueIcon.add(BiCloudSun, IoCloudyNightOutline)

Vue.component('VIcon', OhVueIcon)

export default Vue.extend({
  name: 'ChangeTheme',
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
