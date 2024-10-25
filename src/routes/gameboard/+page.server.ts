import prisma from '$lib/prisma';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
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
			...(await parent()).body,
			enemyShipPlacement: JSON.stringify(findEnemyShipPlacement, (key, value) =>
				typeof value === 'bigint' ? Number(value) : value
			)
		}
	};
};

export const actions: Actions = {
	statusReady: async ({ request }) => {
		const data = await request.formData()
		const name = data.get('name')

		if (typeof name === 'string') {
			console.log('name')

				const findUser = await prisma.players.findMany({
					where: {
						name: 'Kuroko'
					}	
				})

				const findOpponent = await prisma.players.findFirst({
					where: {
						game_status: 'playing'
					}
				});

				console.log('finduser', findUser)
				console.log('find opponent', findOpponent)

				if (findOpponent && findUser) {
					const updatePlayer = await prisma.players.update({
						where: {
							id: findOpponent.id
						},
						data: {
							game_status: 'waiting'
						},
					})
					console.log(updatePlayer)

					const createMatch = await prisma.matches.create({
						data: {
							player1_id: findUser[0].id,
							player2_id: findOpponent.id
						}
					})
					redirect(303, `/gameboard/${createMatch.id}`)
				}

			return { success: true }
		}
	}
}