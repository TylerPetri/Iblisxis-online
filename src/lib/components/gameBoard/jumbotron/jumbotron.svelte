<script lang="ts">
	import { GameActions, Player } from '$lib/types/enum';
	export let hitOrMiss: GameActions.hit | GameActions.miss | undefined;
	export let scenario: GameActions | undefined = undefined;
	export let whosTurn: Player.ally | Player.enemy | undefined

	let actions: GameActions[] = [];

	$: if (GameActions) {
		actions = Object.values(GameActions);
	}
</script>

<div class="wrapper">
	{#each actions as action}
		{#if scenario === action}
			{#if hitOrMiss}
				{#if whosTurn === Player.ally}
					<h1>{Player.enemy}</h1>
				{:else}
					<h1>{Player.ally}</h1>
				{/if}
			{/if}
			<h1>{action}</h1>
		{/if}
	{/each}
</div>

<style lang="scss">
	@import './jumbotron.scss';
</style>
