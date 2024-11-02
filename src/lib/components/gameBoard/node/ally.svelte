<script lang="ts">
	import { page } from '$app/stores';
	import { GameActions } from '$lib/types/enum';
	import type { Ship } from '$lib/types/interface';

	export let idx: number[];
	export let color = 'rgb(116, 21, 32)';
	export let selectedShip: Ship | undefined = undefined;
	export let hovering = false;
	export let hoveringIdx: number[] | undefined = undefined;
	export let inBattlefieldAlly: boolean = false;

	export let hoveringSelectedShipIdx: number;
	export let placingShip: boolean;
	export let authShipPlacement: boolean[];

	export let designatedShipsCount: number;

	export let enemyFiresToIdx: string | undefined;
	export let shipNodeCountAlly: number;
	export let hitOrMiss: GameActions.hit | GameActions.miss | undefined;

	$: ships = $page.data.body.ships
	let designatedNodeData: Ship | null = null;
	let visited: boolean = false;

	$: if (enemyFiresToIdx) {
		if (enemyFiresToIdx === '' + idx[0] + idx[1]) {
			visited = true;
			if (designatedNodeData !== null) {
				hitOrMiss = GameActions.hit;
				shipNodeCountAlly--;
			} else {
				hitOrMiss = GameActions.miss;
			}
		}
	}

	$: if (hovering) {
		hoveringIdx = idx;
		inBattlefieldAlly = true;
	}

	$: if (hoveringSelectedShipIdx !== -1 && selectedShip) {
		if (designatedNodeData === null) {
			color = selectedShip.color;
			authShipPlacement[hoveringSelectedShipIdx] = true;

			if (placingShip) {
				if (!authShipPlacement.includes(false)) {
					designatedNodeData = selectedShip;

					const shipIdx = ships.indexOf(selectedShip);
					ships[shipIdx].designated = true;
					designatedShipsCount++;

					selectedShip = undefined;
				}
			}
		} else {
			authShipPlacement[hoveringSelectedShipIdx] = false;
		}
	}

	$: if (!selectedShip || !inBattlefieldAlly) {
		color = 'rgb(116, 21, 32)';
	}
</script>

<button
	class="node"
	on:mouseover={() => {
		if (designatedShipsCount !== ships.length) hovering = true;
	}}
	on:mouseleave={() => {
		hovering = false;
		placingShip = false;
	}}
	on:focus
	on:blur
	on:click={() => (placingShip = true)}
	disabled={designatedShipsCount === ships.length}
>
	{#if inBattlefieldAlly && (hovering || hoveringSelectedShipIdx !== -1) && designatedNodeData === null}
		<i class="fa-solid fa-circle-dot" style={`color: ${color}`}></i>
	{:else if designatedNodeData !== null}
		{#if !visited}
			<i class="fa-solid fa-circle-dot" style={`color: ${designatedNodeData.color}`}></i>
		{:else if visited}
			<i class="fa-solid fa-x" style={`color: ${designatedNodeData.color}`}></i>
		{/if}
	{:else if visited && designatedNodeData === null}
		<i class="fa-regular fa-circle-dot" style={`color: #434040`}></i>
	{:else}
		<i class="fa-regular fa-circle-dot"></i>
	{/if}
</button>
