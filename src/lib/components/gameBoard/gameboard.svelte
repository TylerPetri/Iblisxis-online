<script lang="ts">
	import NodeAlly from './nodeAlly.svelte';
	import NodeEnemy from './nodeEnemy.svelte';

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

	let hoveringIdx: number[] | undefined = undefined;
	let placingShip: boolean = false;

	function handleShipAssignment(name: string, size: number) {
		placingShip = true;
		for (let i = 0; i < ships.length; i++) {
			if (ships[i].name === name) {
				ships[i].designated = true;
				break;
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
						<NodeAlly
							idx={[i, j]}
							bind:inBattlefieldAlly
							bind:hoveringIdx
							bind:placingShip
							bind:selectedShip
							{dotsDirection}
							{handleShipAssignment}
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
						<NodeEnemy bind:inBattlefieldEnemy />
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
