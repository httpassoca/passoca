<script lang="ts">
	export let classe: string = '';
</script>

<section>
	<div class="container">
		<div class={`flex w-full ${classe}`}>
			<slot />
		</div>
	</div>
</section>

<style lang="sass">
section
  min-height: calc(100vh - 85px)
  display: flex
  justify-content: center
  align-items: center
</style>
