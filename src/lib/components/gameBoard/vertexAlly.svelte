<script lang="ts">
	import { Direction } from '$lib/types/enum';
	import type { Ship } from '$lib/types/interface';

	export let idx: number[];
	export let color = 'rgb(116, 21, 32)';
	export let selectedShip: Ship | undefined = undefined;
	export let hovering = false;
	export let hoveringIdx: number[] | undefined = undefined;
	export let dotsDirection: Direction;
	export let inBattlefieldAlly: boolean = false;

	$: neighbours = setNeighbours(idx);

	let hoveringSelectedShip = false;
	let designatedShip: Ship | undefined = undefined;

	/**
	 * @param idx
	 * @return [left, up, right, down]
	 */
	function setNeighbours(idx: number[]) {
		const inBounds = [idx[1] - 1 >= 0, idx[0] - 1 >= 0, idx[1] + 1 <= 9, idx[0] + 1 <= 9];
		const neighbours = new Array(4).fill(null);
		const positions = [
			[idx[0], idx[1] - 1],
			[idx[0] - 1, idx[1]],
			[idx[0], idx[1] + 1],
			[idx[0] + 1, idx[1]]
		];

		for (let i = 0; i < neighbours.length; i++) {
			if (inBounds[i]) {
				neighbours[i] = positions[i];
			}
		}

		return neighbours;
	}

	$: if (hovering) {
		hoveringIdx = idx;
		inBattlefieldAlly = true;
	}

	$: if (!selectedShip || !inBattlefieldAlly) {
		hoveringSelectedShip = false;
		color = 'rgb(116, 21, 32)';
	}

	// /**
	//  * When change row or column and exceeding grid, reset to default
	//  */
	// $: if (
	// 	hoveringIdx &&
	// 	hoveringSelectedShip &&
	// 	dotsDirection === Direction.horizontal &&
	// 	idx[0] !== hoveringIdx[0]
	// ) {
	// 	hoveringSelectedShip = false;
	// }
	// $: if (
	// 	hoveringIdx &&
	// 	hoveringSelectedShip &&
	// 	dotsDirection === Direction.vertical &&
	// 	idx[1] !== hoveringIdx[1]
	// ) {
	// 	hoveringSelectedShip = false;
	// }
	// /**
	//  * Click and drop battleship within grid when horizontal
	//  */
	// $: if (
	// 	!designatedShip &&
	// 	selectedShip &&
	// 	hoveringIdx &&
	// 	idx[1] <= hoveringIdx[1] + selectedShip.size - 1 &&
	// 	(idx[1] >= hoveringIdx[1] || idx[1] >= 10 - selectedShip.size) &&
	// 	idx[0] === hoveringIdx[0] &&
	// 	dotsDirection === Direction.horizontal
	// ) {
	// 	hoveringSelectedShip = true;
	// 	color = selectedShip.color;
	// } else if (
	// 	hoveringSelectedShip &&
	// 	selectedShip &&
	// 	hoveringIdx &&
	// 	!(
	// 		idx[1] <= hoveringIdx[1] + selectedShip.size - 1 &&
	// 		idx[1] >= hoveringIdx[1] &&
	// 		idx[0] === hoveringIdx[0]
	// 	) &&
	// 	!(hoveringIdx[1] + selectedShip.size - 1 > 9) &&
	// 	dotsDirection === Direction.horizontal
	// ) {
	// 	hoveringSelectedShip = false;
	// }
	// /**
	//  * Click and drop battleship within grid when vertical
	//  */
	// $: if (
	// 	!designatedShip &&
	// 	selectedShip &&
	// 	hoveringIdx &&
	// 	idx[0] <= hoveringIdx[0] + selectedShip.size - 1 &&
	// 	(idx[0] >= hoveringIdx[0] || idx[0] >= 10 - selectedShip.size) &&
	// 	idx[1] === hoveringIdx[1] &&
	// 	dotsDirection === Direction.vertical
	// ) {
	// 	hoveringSelectedShip = true;
	// 	color = selectedShip.color;
	// } else if (
	// 	hoveringSelectedShip &&
	// 	selectedShip &&
	// 	hoveringIdx &&
	// 	!(
	// 		idx[0] <= hoveringIdx[0] + selectedShip.size - 1 &&
	// 		idx[0] >= hoveringIdx[0] &&
	// 		idx[1] === hoveringIdx[1]
	// 	) &&
	// 	dotsDirection === Direction.vertical
	// ) {
	// 	hoveringSelectedShip = false;
	// }

	export let selectedShipSizeCount: number;
	export let nextSelectShipIdx: number[] | undefined;

	$: if (
		(hovering && selectedShip && !nextSelectShipIdx) ||
		(nextSelectShipIdx && nextSelectShipIdx[0] === idx[0] && nextSelectShipIdx[1] && idx[1])
	) {
		hoveringSelectedShip = true;
		selectedShipSizeCount--;
		if (dotsDirection === Direction.horizontal) {
			if (neighbours[2]) {
				nextSelectShipIdx = neighbours[2];
			} else if (neighbours[0]) {
				nextSelectShipIdx = neighbours[0];
			}
		}
	}

	function handleHoverOnShipSelect(idx: number[], neighbours: number[][]) {
		if (dotsDirection === Direction.horizontal) {
		}
	}
</script>

<button
	class="node"
	on:mouseover={() => {
		hovering = true;
		if (selectedShip !== undefined) {
			handleHoverOnShipSelect(idx, neighbours);
		}
	}}
	on:mouseout={() => (hovering = false)}
	on:focus
	on:blur
>
	{#if inBattlefieldAlly && (hovering || hoveringSelectedShip) && !designatedShip}
		<i class="fa-solid fa-circle-dot" style={`color: ${color}`}></i>
	{:else}
		<i class="fa-regular fa-circle-dot"></i>
	{/if}
</button>
