<template>
  <div class="changeTheme h-8 w-8" @click="changeTheme">
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
  position: fixed
  top: 10px
  right: 10px
  cursor: pointer
  z-index: 99
</style>
