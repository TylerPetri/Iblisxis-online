<script lang="ts">
	import Jumbotron from './jumbotron/jumbotron.svelte';
	import NodeAlly from './node/ally.svelte';
	import NodeEnemy from './node/enemy.svelte';

	import { Direction, GameActions, Player } from '$lib/types/enum';
	import type { Ship } from '$lib/types/interface';

	import aircraftCarrier from '$lib/assets/ships/aircraft-carrier.png';
	import battleship from '$lib/assets/ships/battleship.png';
	import cruiser from '$lib/assets/ships/cruiser.png';
	import destroyer from '$lib/assets/ships/destroyer.png';
	import submarine from '$lib/assets/ships/submarine.png';

	export let ships: Ship[];

	const columns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

	let inBattlefieldAlly: boolean = false;
	let inBattlefieldEnemy: boolean = false;

	let dotsDirection = Direction.horizontal;
	let selectedShip: Ship | undefined = undefined;

	let hoveringIdx: number[] = [];
	let hoveringSelectedShipList: number[] = [];

	let placingShip: boolean = false;
	let authShipPlacement: boolean[] = [];

	let designatedShipsCount: number = 0;
	let shipNodeCountAlly: number = 0;
	let shipNodeCountEnemy: number = 0;

	if (ships.length) {
		ships.forEach((ship) => {
			shipNodeCountAlly += ship.size;
			shipNodeCountEnemy += ship.size;

			switch (ship.name) {
				case 'aircraftCarrier':
					ship.image = aircraftCarrier;
					return ship;
				case 'battleship':
					ship.image = battleship;
					return ship;
				case 'cruiser':
					ship.image = cruiser;
					return ship;
				case 'destroyer':
					ship.image = destroyer;
					return ship;
				case 'submarine':
					ship.image = submarine;
					return ship;
				default:
					return ship;
			}
		});
	}

	import enemyShipPlacements from '$lib/db/mockEnemyShipPlacement.json';
	import { enemyShipCoordsFill } from '$lib/db/controllers/enemyShips';
	const enemyShips = enemyShipPlacements.ships;
	const enemyCoords = enemyShips.map((ship) => {
		return enemyShipCoordsFill(ship);
	});

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

	$: if (selectedShip && authShipPlacement.length < selectedShip.size) {
		while (authShipPlacement.length < selectedShip.size) {
			authShipPlacement.push(false);
		}
	} else if (selectedShip && authShipPlacement.length > selectedShip.size) {
		while (authShipPlacement.length > selectedShip.size) {
			authShipPlacement.pop();
		}
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

	let hitOrMiss: GameActions.hit | GameActions.miss | undefined = undefined;
	let whosTurn: Player | undefined = undefined;
	let exclude: string[] = [];
	let enemyFiresToIdx: string | undefined = undefined;
	$: if (whosTurn === Player.enemy && shipNodeCountAlly !== 0 && shipNodeCountEnemy !== 0) {
		setTimeout(() => {
			function generateRandom(count: number = 0) {
				const row = Math.floor(Math.random() * 9);
				const column = Math.floor(Math.random() * 9);
				const idx = '' + row + column;

				let throttlecount = 0;

				if (throttlecount >= 10) {
					for (let i = 0; i < exclude.length; i++) {
						const x = parseInt(idx) + 1;
						const y = '' + x;
						if (!exclude.includes(y) && x < 100 && x > 0) {
							exclude.push(y);
							return y;
						}
					}
				}

				if (exclude.includes(idx) && throttlecount < 10) {
					count++;
					generateRandom(count);
				} else {
					exclude.push(idx);
					return idx;
				}
			}
			enemyFiresToIdx = generateRandom();
			whosTurn = Player.ally;
		}, 1000);
	}

	let jumbotronScenario: GameActions;
	$: if (designatedShipsCount === ships.length) {
		jumbotronScenario = GameActions.start;
		if (!whosTurn) whosTurn = Player.ally;

		if (hitOrMiss === GameActions.hit) {
			jumbotronScenario = GameActions.hit;
		} else if (hitOrMiss === GameActions.miss) {
			jumbotronScenario = GameActions.miss;
		}

		if (shipNodeCountAlly === 0) {
			jumbotronScenario = GameActions.youLose;
		}
		if (shipNodeCountEnemy === 0) {
			jumbotronScenario = GameActions.youWin;
		}
	}
</script>

<div class="wrapper">
	<div class="boardgame-container">
		{#if designatedShipsCount === enemyShips.length}
			<Jumbotron scenario={jumbotronScenario} {hitOrMiss} {whosTurn} />
			<div class="enemy-board" on:mouseleave={() => (inBattlefieldEnemy = false)} role="table">
				{#each rows as row, i}
					<div class="row">
						{#each columns as col, j}
							<NodeEnemy
								bind:inBattlefieldEnemy
								ship={enemyShips[
									enemyCoords.findIndex(
										(x) => x.coords?.row.includes(i) && x.coords.column.includes(j)
									)
								]}
								bind:hitOrMiss
								bind:whosTurn
								bind:shipNodeCountEnemy
							/>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
		<div
			class="ally-board"
			class:border={designatedShipsCount === ships.length}
			on:mouseleave={() => (inBattlefieldAlly = false)}
			role="table"
		>
			{#each rows as row, i}
				<div class="row">
					{#each columns as col, j}
						<NodeAlly
							idx={[i, j]}
							bind:authShipPlacement
							bind:hoveringIdx
							hoveringSelectedShipIdx={hoveringSelectedShipList &&
								(dotsDirection === Direction.horizontal && hoveringSelectedShipList[0] === i
									? hoveringSelectedShipList.slice(1, hoveringSelectedShipList.length).indexOf(j)
									: dotsDirection === Direction.vertical && hoveringSelectedShipList[0] === j
										? hoveringSelectedShipList.slice(1, hoveringSelectedShipList.length).indexOf(i)
										: -1)}
							bind:hitOrMiss
							bind:inBattlefieldAlly
							bind:selectedShip
							bind:placingShip
							bind:ships
							bind:designatedShipsCount
							bind:shipNodeCountAlly
							{enemyFiresToIdx}
						/>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	{#if designatedShipsCount !== ships.length}
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
	{/if}
</div>

<style lang="scss">
	@use './gameboard.scss';
</style>
