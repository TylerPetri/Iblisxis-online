<script lang="ts">
	import VertexAlly from './vertexAlly.svelte';
	import VertexEnemy from './vertexEnemy.svelte';

	import { Direction, Player } from '$lib/types/enum';
	import type { Ship } from '$lib/types/interface';

	import aircraftCarrier from '$lib/assets/ships/aircraft-carrier.png';
	import battleship from '$lib/assets/ships/battleship.png';
	import cruiser from '$lib/assets/ships/cruiser.png';
	import destroyer from '$lib/assets/ships/destroyer.png';
	import submarine from '$lib/assets/ships/submarine.png';

	const columns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

	let inBattlefieldAlly: boolean = false;
	let inBattlefieldEnemy: boolean = false;

	let dotsDirection = Direction.horizontal;
	let selectedShip: Ship | undefined = undefined;

	let hoveringIdx: number[] = [];
	let hoveringSelectedShipList: number[] = [];

	const ships = [
		{
			name: 'aircraft-carrier',
			image: aircraftCarrier,
			size: 5,
			color: 'orange',
			designated: false
		},
		{
			name: 'battleship',
			image: battleship,
			size: 4,
			color: 'red',
			designated: false
		},
		{
			name: 'cruiser',
			image: cruiser,
			size: 3,
			color: 'grey',
			designated: false
		},
		{
			name: 'submarine',
			image: submarine,
			size: 3,
			color: 'green',
			designated: false
		},
		{
			name: 'destroyer',
			image: destroyer,
			size: 2,
			color: 'purple',
			designated: false
		}
	];

	function handleClickShip(shipName: string) {
		if (selectedShip?.name === shipName) {
			selectedShip = undefined;
		} else {
			selectedShip = ships.find((x) => x.name === shipName);
		}
	}

	function handleRotate() {
		dotsDirection === Direction.horizontal
			? (dotsDirection = Direction.vertical)
			: (dotsDirection = Direction.horizontal);
	}

	$: if (selectedShip && hoveringIdx) {
		let size = selectedShip.size - 1;
		if (dotsDirection === Direction.horizontal) {
			let rightNodes = 9 - hoveringIdx[1];
			let leftNodes = 0 + hoveringIdx[1];
			// fits, done
			if (rightNodes >= size) {
				hoveringSelectedShipList = [hoveringIdx[0], hoveringIdx[1]];
				while (size > 0) {
					hoveringSelectedShipList = [...hoveringSelectedShipList, hoveringIdx[1] + size];
					size--;
				}
			}
			// doesnt fit, add the difference to the left
			if (rightNodes < size) {
				let difference = size - rightNodes;
				if (leftNodes >= difference) {
					hoveringSelectedShipList = [hoveringIdx[0], hoveringIdx[1]];
					while (difference > 0 || rightNodes > 0) {
						if (difference > 0) {
							hoveringSelectedShipList = [...hoveringSelectedShipList, hoveringIdx[1] - difference];
							difference--;
						}
						if (rightNodes > 0) {
							hoveringSelectedShipList = [...hoveringSelectedShipList, hoveringIdx[1] + rightNodes];
							rightNodes--;
						}
					}
				}
			}
		}
		if (dotsDirection === Direction.vertical) {
			let nodesBelow = 9 - hoveringIdx[0];
			let nodesAbove = 0 + hoveringIdx[0];
			// fits, done
			if (nodesBelow >= size) {
				hoveringSelectedShipList = [hoveringIdx[1], hoveringIdx[0]];
				while (size > 0) {
					hoveringSelectedShipList = [...hoveringSelectedShipList, hoveringIdx[0] + size];
					size--;
				}
			}
			// doesnt fit, add the difference to the left
			if (nodesBelow < size) {
				let difference = size - nodesBelow;
				if (nodesAbove >= difference) {
					hoveringSelectedShipList = [hoveringIdx[1], hoveringIdx[0]];
					while (difference > 0 || nodesBelow > 0) {
						if (difference > 0) {
							hoveringSelectedShipList = [...hoveringSelectedShipList, hoveringIdx[0] - difference];
							difference--;
						}
						if (nodesBelow > 0) {
							hoveringSelectedShipList = [...hoveringSelectedShipList, hoveringIdx[0] + nodesBelow];
							nodesBelow--;
						}
					}
				}
			}
		}
	}
</script>

<div class="wrapper">
	<div class="boardgame-container">
		<div class="ally-board" on:mouseleave={() => (inBattlefieldAlly = false)} role="table">
			{#each rows as row, i}
				<div class="row">
					{#each columns as col, j}
						<VertexAlly
							idx={[i, j]}
							bind:hoveringIdx
							hoveringSelectedShip={hoveringSelectedShipList &&
								(dotsDirection === Direction.horizontal
									? hoveringSelectedShipList[0] === i &&
										hoveringSelectedShipList.slice(1, hoveringSelectedShipList.length).includes(j)
									: hoveringSelectedShipList[0] === j &&
										hoveringSelectedShipList.slice(1, hoveringSelectedShipList.length).includes(i))}
							bind:inBattlefieldAlly
							bind:selectedShip
						/>
					{/each}
				</div>
			{/each}
		</div>
		<div class="divider" />
		<div class="enemy-board" on:mouseleave={() => (inBattlefieldEnemy = false)} role="table">
			{#each rows as row, i}
				<div class="row">
					{#each columns as col, j}
						<VertexEnemy bind:inBattlefieldEnemy />
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="ship-selection-container">
		{#each ships as ship, i}
			{#key ship.designated}
				<button
					class="ship-container"
					class:selected={selectedShip === ship}
					class:disabled={ship.designated}
					on:click={() => handleClickShip(ship.name)}
					disabled={ship.designated}
				>
					<div class="image-container">
						<img src={ship.image} alt={ship.image} />
					</div>
					<div class="dots" class:vertical={dotsDirection === Direction.vertical}>
						{#each { length: ship.size } as s}
							<i class="fa-solid fa-circle-dot" style={`color: ${ship.color}`}></i>
						{/each}
					</div>
				</button>
			{/key}
		{/each}
		<button class="rotate" on:click={() => handleRotate()}
			><i class="fa-solid fa-arrows-spin"></i></button
		>
	</div>
</div>

<style lang="scss">
	@import './gameboard.scss';
</style>
