<template lang="pug">
  section
    .container
      .flex.w-full(:class="classe")
        slot
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Content',
  props: {
    classe: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="sass" scoped>
section
  min-height: calc(100vh - 85px)
  display: flex
  justify-content: center
  align-items: center
</style>
