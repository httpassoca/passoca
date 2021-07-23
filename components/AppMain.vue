<template>
  <BaseMarkdownView :value="''" />
</template>

<script lang="ts">
import Vue from 'vue'
import marked from 'marked'

import hljs from 'highlight.js/lib/core'
import jsHighlight from 'highlight.js/lib/languages/javascript'

interface Top {
  input: String;
}
export default Vue.extend({
  name: 'AppMain',
  data (): Top {
    return {
      input: '# hello'
    }
  },
  computed: {
    compiledMarkdown (): void {
      return marked(this.input, {
        highlight (markdown:any) {
          return hljs.highlightAuto(markdown).value
        }
      })
    }
  },
  mounted () {
    hljs.registerLanguage('javascript', jsHighlight)
    hljs.highlightAll()
  }
})
</script>

<style lang="sass">
.markdown-area
  h1
    font-size: 2.2rem
  h2
    font-size: 1.65rem

  h1, h2, h3, h4, h5, h6
    font-weight: 600
    line-height: 1.25
</style>
