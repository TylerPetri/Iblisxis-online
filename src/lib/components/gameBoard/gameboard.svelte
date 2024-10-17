<script lang="ts">
	import aircraftCarrier from '$lib/assets/ships/aircraft-carrier.png';
	import battleship from '$lib/assets/ships/battleship.png';
	import cruiser from '$lib/assets/ships/cruiser.png';
	import destroyer from '$lib/assets/ships/destroyer.png';
	import submarine from '$lib/assets/ships/submarine.png';

	enum Player {
		ally = 'ally',
		enemy = 'enemy'
	}

	enum Direction {
		horizontal = 'horizontal',
		vertical = 'vertical'
	}

	interface Ship {
		name: string;
		image: string;
		size: number;
		color: string;
	}

	const columns: number = 10;
	const rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

	let inBattlefieldAlly: boolean = false;
	let inBattlefieldEnemy: boolean = false;

	let hoveringAlly: number[][] | undefined[][] = [[undefined], [undefined]];
	let hoveringEnemy: number[] | undefined[] = [undefined, undefined];

	let visitedAlly: string[] = [];
	let visitedEnemy: string[] = [];

	let dotsDirection = Direction.horizontal;
	let selectedShip: Ship | undefined = undefined;

	$: if (
		selectedShip &&
		(dotsDirection === Direction.horizontal || dotsDirection === Direction.vertical)
	) {
		if (dotsDirection === Direction.horizontal) {
			hoveringAlly[1] = new Array(selectedShip.size).fill(undefined);
			hoveringAlly[0] = [undefined];
		}
		if (dotsDirection === Direction.vertical) {
			hoveringAlly[0] = new Array(selectedShip.size).fill(undefined);
			hoveringAlly[1] = [undefined];
		}
	}

	const ships = [
		{
			name: 'aircraft-carrier',
			image: aircraftCarrier,
			size: 5,
			color: 'orange'
		},
		{
			name: 'battleship',
			image: battleship,
			size: 4,
			color: 'red'
		},
		{
			name: 'cruiser',
			image: cruiser,
			size: 3,
			color: 'grey'
		},
		{
			name: 'submarine',
			image: submarine,
			size: 3,
			color: 'green'
		},
		{
			name: 'destroyer',
			image: destroyer,
			size: 2,
			color: 'purple'
		}
	];

	function handleHover(player: Player, row: number, col: number): void {
		if (player === Player.enemy) {
			hoveringEnemy = [row, col];
		} else {
			if (selectedShip) {
				if (dotsDirection === Direction.horizontal) {
					for (let i = 0; i < selectedShip.size; i++) {
						hoveringAlly[1][i] = col + i;
					}
					hoveringAlly[0][0] = row;
				}
				if (dotsDirection === Direction.vertical) {
					for (let i = 0; i < selectedShip.size; i++) {
						hoveringAlly[0][i] = row + i;
					}
					hoveringAlly[1][0] = col;
				}
			} else {
				hoveringAlly = [[row], [col]];
			}
		}
	}

	function handleClickCell(player: Player, row: number, col: number): void {
		if (!visitedEnemy.includes('' + row + col)) {
			if (player === Player.enemy) {
				visitedEnemy = [...visitedEnemy, '' + row + col];
			} else {
				if (selectedShip) {
				}
				visitedAlly = [...visitedAlly, '' + row + col];
			}
		}
	}

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
</script>

<div class="wrapper">
	<div class="boardgame-container">
		<div
			class="ally-board"
			on:mouseenter={() => (inBattlefieldAlly = true)}
			on:mouseleave={() => (inBattlefieldAlly = false)}
			role="table"
		>
			{#each rows as row, i}
				<div class="row">
					{#each { length: columns } as col, j}
						<button
							class="node"
							class:visited={visitedAlly.includes('' + i + j)}
							on:mouseover={() => handleHover(Player.ally, i, j)}
							on:focus
							on:click={() => handleClickCell(Player.ally, i, j)}
						>
							{#if inBattlefieldAlly && selectedShip && dotsDirection === Direction.horizontal && hoveringAlly[1].findIndex((x) => x === j) !== -1 && hoveringAlly[0][0] === i}
								<i class="fa-solid fa-circle-dot" style={`color: ${selectedShip.color}`}></i>
							{:else if inBattlefieldAlly && selectedShip && dotsDirection === Direction.vertical && hoveringAlly[0].findIndex((x) => x === i) !== -1 && hoveringAlly[1][0] === j}
								<i class="fa-solid fa-circle-dot" style={`color: ${selectedShip.color}`}></i>
							{:else}
								<i class="fa-regular fa-circle-dot"></i>
							{/if}
						</button>
					{/each}
				</div>
			{/each}
		</div>
		<div class="divider" />
		<div
			class="enemy-board"
			on:mouseenter={() => (inBattlefieldEnemy = true)}
			on:mouseleave={() => (inBattlefieldEnemy = false)}
			role="table"
		>
			{#each rows as row, i}
				<div class="row">
					{#each { length: columns } as col, j}
						<button
							class="node"
							class:visited={visitedEnemy.includes('' + i + j)}
							on:mouseover={() => handleHover(Player.enemy, i, j)}
							on:focus
							on:click={() => handleClickCell(Player.enemy, i, j)}
						>
							{#if inBattlefieldEnemy && hoveringEnemy[0] === i && hoveringEnemy[1] === j && !visitedEnemy.includes('' + i + j)}
								<i class="fa-solid fa-circle-dot"></i>
							{:else}
								<i class="fa-regular fa-circle-dot"></i>
							{/if}
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="ship-selection-container">
		{#each ships as ship, i}
			<button
				class="ship-container"
				class:selected={selectedShip === ship}
				on:click={() => handleClickShip(ship.name)}
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
		{/each}
		<button class="rotate" on:click={() => handleRotate()}
			><i class="fa-solid fa-rotate-right"></i></button
		>
	</div>
</div>

<style lang="scss">
	@import './gameboard.scss';
</style>
