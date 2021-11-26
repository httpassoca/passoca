<script lang="ts">
	import '../app.css';
	import AppHeader from '$lib/AppHeader.svelte';
	import 'tailwindcss/tailwind.css';
	let dark = true;
</script>

<main class:dark>
	<div>
		<div class="bg-background dark:bg-darkBackground dark:text-darkText">
			<AppHeader bind:dark />
			<slot class="screen-content" />
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

	.main
		min-height: calc(100vh - 400px)

	.font-boston
		font-family: 'Boston Black It'

	canvas
		position: fixed
		top: 0
		left: 0
		z-index: 0

	.screen-content
		min-height: 100vh
		z-index: 1
		position: relative
</style>
