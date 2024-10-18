<script lang="ts">
	import { Direction } from '$lib/types/enum';
	import type { Ship } from '$lib/types/interface';

	export let idx: number[];
	export let color = 'rgb(116, 21, 32)';
	export let selectedShip: Ship | undefined = undefined;
	export let hovering = false;
	export let hoveringIdx: number[] | undefined = undefined;
	export let dotsDirection;
	export let inBattlefieldAlly: boolean = false;
	export let placingShip: boolean;

	export let handleShipAssignment;

	let hoveringSelectedShip = false;
	let designatedShip: Ship | undefined = undefined;

	$: if (hovering) {
		hoveringIdx = idx;
		inBattlefieldAlly = true;
	}

	$: if (!selectedShip || !inBattlefieldAlly) {
		hoveringSelectedShip = false;
		color = 'rgb(116, 21, 32)';
	}

	/**
	 * Designate ship to node
	 */
	$: if (placingShip && hoveringSelectedShip) {
			designatedShip = selectedShip;
			hoveringSelectedShip = false;
			selectedShip = undefined;
			placingShip = false;
	}
	/**
	 * Reset placingShip so it can be triggered
	 */
	$: if (placingShip && !hoveringSelectedShip) {
		placingShip = false;
	}
	/**
	 * When change row or column and exceeding grid, reset to default
	 */
	$: if (
		hoveringIdx &&
		hoveringSelectedShip &&
		dotsDirection === Direction.horizontal &&
		idx[0] !== hoveringIdx[0]
	) {
		hoveringSelectedShip = false;
	}
	$: if (
		hoveringIdx &&
		hoveringSelectedShip &&
		dotsDirection === Direction.vertical &&
		idx[1] !== hoveringIdx[1]
	) {
		hoveringSelectedShip = false;
	}
	/**
	 * Click and drop battleship within grid when horizontal
	 */ 
	$: if (
		!designatedShip &&
		selectedShip &&
		hoveringIdx &&
		idx[1] <= hoveringIdx[1] + selectedShip.size - 1 &&
		(idx[1] >= hoveringIdx[1] || idx[1] >= 10 - selectedShip.size) &&
		idx[0] === hoveringIdx[0] &&
		dotsDirection === Direction.horizontal
	) {
		hoveringSelectedShip = true;
		color = selectedShip.color;
	} else if (
		hoveringSelectedShip &&
		selectedShip &&
		hoveringIdx &&
		!(
			idx[1] <= hoveringIdx[1] + selectedShip.size - 1 &&
			idx[1] >= hoveringIdx[1] &&
			idx[0] === hoveringIdx[0]
		) &&
		!(hoveringIdx[1] + selectedShip.size - 1 > 9) &&
		dotsDirection === Direction.horizontal
	) {
		hoveringSelectedShip = false;
	}
	/**
	 * Click and drop battleship within grid when vertical
	 */
	$: if (
		!designatedShip &&
		selectedShip &&
		hoveringIdx &&
		idx[0] <= hoveringIdx[0] + selectedShip.size - 1 &&
		(idx[0] >= hoveringIdx[0] || idx[0] >= 10 - selectedShip.size) &&
		idx[1] === hoveringIdx[1] &&
		dotsDirection === Direction.vertical
	) {
		hoveringSelectedShip = true;
		color = selectedShip.color;
	} else if (
		hoveringSelectedShip &&
		selectedShip &&
		hoveringIdx &&
		!(
			idx[0] <= hoveringIdx[0] + selectedShip.size - 1 &&
			idx[0] >= hoveringIdx[0] &&
			idx[1] === hoveringIdx[1]
		) &&
		dotsDirection === Direction.vertical
	) {
		hoveringSelectedShip = false;
	}
</script>

<button
	class="node"
	on:click={() => {
		if (!designatedShip && selectedShip) {
			handleShipAssignment(selectedShip.name, selectedShip.size);
		}
	}}
	on:mouseover={() => (hovering = true)}
	on:mouseout={() => (hovering = false)}
	on:focus
	on:blur
>
	{#if inBattlefieldAlly && (hovering || hoveringSelectedShip) && !designatedShip}
		<i class="fa-solid fa-circle-dot" style={`color: ${color}`}></i>
	{:else if designatedShip}
		<i class="fa-solid fa-circle-dot" style={`color: ${designatedShip.color}`}></i>
	{:else}
		<i class="fa-regular fa-circle-dot"></i>
	{/if}
</button>
