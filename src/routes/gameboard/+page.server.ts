import prisma from '$lib/prisma';

export async function load() {
	const allShips = await prisma.ships.findMany();
	const findPlayer = await prisma.players.findMany({
		where: {
			name: 'Jabami'
		},
		select: {
			id: true
		}
	});
	const findMatch = await prisma.matches.findMany({
		where: {
			player1_id: findPlayer[0].id
		},
		select: {
			id: true,
			player2_id: true
		}
	});
	const findEnemyShipPlacement = await prisma.enemy_ship_placements.findMany({
		where: {
			match_id: findMatch[0].id,
			player_id: findMatch[0].player2_id
		},
    include: {
      ships: true
    }
	});

	return {
		statusCode: 200,
		body: {
			ships: JSON.stringify(allShips, (key, value) =>
				typeof value === 'bigint' ? Number(value) : value
			),
			enemyShipPlacement: JSON.stringify(findEnemyShipPlacement, (key, value) =>
				typeof value === 'bigint' ? Number(value) : value
			)
		}
	};
}
