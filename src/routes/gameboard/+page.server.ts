// import { handler } from '../../../netlify/functions/getShips'

import prisma from '$lib/prisma'

export async function load() {
  // return await handler()
  const allShips = await prisma.ships.findMany();

	return {
		statusCode: 200,
		body: JSON.stringify(allShips, (key, value) =>
			typeof value === 'bigint' ? Number(value) : value
		)
	};
}