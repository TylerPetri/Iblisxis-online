<script lang="ts">
	import { GameActions } from '$lib/types/enum';
	export let scenario: GameActions | undefined = undefined;
</script>

<div class="wrapper">
	{#if scenario === GameActions.start || !scenario}
		<h1>Ready? Go!</h1>
	{:else if scenario === GameActions.waiting}
		<h1>Thinking...</h1>
	{:else if scenario === GameActions.yourTurn}
		<h1>Your Go!</h1>
	{:else if scenario === GameActions.opponentTurn}
		<h1>Enemy Thinking...</h1>
	{/if}
</div>

<style lang="scss">
@import './jumbotron.scss';
</style>
