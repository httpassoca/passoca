<script lang="ts">
  import "../app.css";
  import Header from "$lib/components/Base/AppHeader.svelte";
  import { dark } from "$lib/stores/theme.store";
</script>

<main class:dark={$dark}>
  <div>
    <div class="content dark:text-darkText pb-32">
      <Header />
      <slot />
    </div>
    <!-- <AppFooter /> -->
  </div>
</main>

<style lang="sass">
:global

	html
		font-family: 'Noto Sans JP', 'Source Sans Pro', sans-serif
		font-size: 20px
		line-height: 1.3
		-ms-text-size-adjust: 100%
		-webkit-text-size-adjust: 100%
		-moz-osx-font-smoothing: grayscale
		-webkit-font-smoothing: antialiased

	*,
	*::before,
	*::after
		box-sizing: border-box
		margin: 0
		padding: 0
		outline: none
		transition: all .25s cubic-bezier(0.215,0.61,0.355,1)
		scroll-behavior: smooth

	*::selection
		background-color: var(--color-accent)
		color: black
	.vh-full
		min-height: 100vh
	main
		--color-accent: #66ef73
		color: var(--color-text)
		.content
			background-color: var(--color-background)

	.font-boston
		font-family: 'Boston Black It'

	main.dark
		--color-triangle: #66ef73
		--color-background: #100f10
		--color-text: #e0e0e0
	main:not(.dark)
		--color-triangle: #000
		--color-background: #f6fff1
		--color-text: #000
</style>
