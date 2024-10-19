<script lang="ts">
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

	export let ships: Ship[];
	export let designatedShipsCount: number

	let designatedNodeData: Ship | null = null;

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
					designatedShipsCount++

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
	on:mouseover={() => (hovering = true)}
	on:mouseleave={() => {
		hovering = false;
		placingShip = false;
	}}
	on:focus
	on:blur
	on:click={() => (placingShip = true)}
>
	{#if inBattlefieldAlly && (hovering || hoveringSelectedShipIdx !== -1) && designatedNodeData === null}
		<i class="fa-solid fa-circle-dot" style={`color: ${color}`}></i>
	{:else if designatedNodeData !== null}
		<i class="fa-solid fa-circle-dot" style={`color: ${designatedNodeData.color}`}></i>
	{:else}
		<i class="fa-regular fa-circle-dot"></i>
	{/if}
</button>
