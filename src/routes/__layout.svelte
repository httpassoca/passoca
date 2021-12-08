<script lang="ts">
  import "../app.css";
  import AppHeader from "$lib/AppHeader.svelte";
  import { dark } from "../stores/store";
</script>

<main class:dark={$dark}>
  <div>
    <div class="bg-background dark:bg-darkBackground dark:text-darkText pb-32">
      <AppHeader />
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

	main
		--color-accent: #66ef73
		color: var(--color-text)

	.font-boston
		font-family: 'Boston Black It'

	main.dark
		--color-triangle: #66ef73
		--color-text: #e0e0e0
	main:not(.dark)
		--color-triangle: #000
		--color-text: #000
</style>
