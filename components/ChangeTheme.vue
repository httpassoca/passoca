<template>
  <div class="changeTheme h-6 w-6" @click="changeTheme">
    <OutlineSunIcon v-if="darkMode" />
    <OutlineMoonIcon v-else />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ChangeTheme',
  data () {
    return {
      darkMode: true
    }
  },
  mounted () {
    this.darkMode = this.$colorMode.preference === 'dark-mode'
  },
  methods: {
    changeTheme (): void {
      this.$colorMode.preference = this.darkMode ? 'light' : 'dark-mode'
      this.darkMode = !this.darkMode
    }
  }
})
</script>

<style lang="sass" scoped>
.changeTheme
  cursor: pointer
  z-index: 99
</style>
