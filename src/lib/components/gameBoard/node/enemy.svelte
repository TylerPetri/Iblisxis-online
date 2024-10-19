<script lang="ts">
	import { Player } from '$lib/types/enum';
	import type { Ship } from '$lib/types/interface';
	export let color = 'rgb(116, 21, 32)';
	export let inBattlefieldEnemy: boolean = false;
	export let ship: Ship | undefined = undefined;
	export let whosTurn: Player;

	let visited: boolean = false;
	let hovering: boolean = false;

	$: if (hovering) {
		inBattlefieldEnemy = true;
	}
</script>

<button
	class="node"
	on:click={() => {
		if (whosTurn === Player.ally) {
			visited = true;
			whosTurn = Player.enemy;
		}
	}}
	on:mouseover={() => (hovering = true)}
	on:mouseout={() => (hovering = false)}
	on:focus
	on:blur
	disabled={color === ship?.color || whosTurn === Player.enemy}
>
	{#if inBattlefieldEnemy && hovering && !visited}
		<i class="fa-solid fa-circle-dot" style={`color: ${color}`}></i>
	{:else if visited && !ship}
		<i class="fa-regular fa-circle-dot" style={`color: #434040`}></i>
	{:else if visited && ship}
		<i class="fa-regular fa-circle-dot" style={`color: ${ship.color}`}></i>
	{:else}
		<i class="fa-regular fa-circle-dot"></i>
	{/if}
</button>
