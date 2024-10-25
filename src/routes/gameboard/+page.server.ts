import prisma from '$lib/prisma';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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
						game_status: 'waiting'
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
							game_status: 'playing'
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