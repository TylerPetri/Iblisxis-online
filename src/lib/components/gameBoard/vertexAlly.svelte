<script lang="ts">
	import { Direction } from '$lib/types/enum';
	import type { Ship } from '$lib/types/interface';

	export let idx: number[];
	export let color = 'rgb(116, 21, 32)';
	export let selectedShip: Ship | undefined = undefined;
	export let hovering = false;
	export let hoveringIdx: number[] | undefined = undefined;
	export let inBattlefieldAlly: boolean = false;

	export let hoveringSelectedShip: boolean;

	$: neighbours = setNeighbours(idx);

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

	$: if (hoveringSelectedShip && selectedShip) {
		color = selectedShip.color
	}

	$: if (!selectedShip || !inBattlefieldAlly) {
		hoveringSelectedShip = false;
		color = 'rgb(116, 21, 32)';
	}
</script>

<button
	class="node"
	on:mouseover={() => (hovering = true)}
	on:mouseleave={() => (hovering = false)}
	on:focus
	on:blur
>
	{#if hovering || hoveringSelectedShip}
		<i class="fa-solid fa-circle-dot" style={`color: ${color}`}></i>
	{:else}
		<i class="fa-regular fa-circle-dot"></i>
	{/if}
</button>
