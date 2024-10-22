<script lang="ts">
	import Gameboard from '$lib/components/gameBoard/gameboard.svelte';

	export let data
</script>

<div class="wrapper">
	<Gameboard ships={JSON.parse(data.body)}/>
</div>

<style lang="scss">
	.wrapper {
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: black;
	}
</style>
