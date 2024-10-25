import prisma from '$lib/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const allShips = await prisma.ships.findMany();
  return {
		statusCode: 200,
		body: {
			ships: JSON.stringify(allShips, (key, value) =>
				typeof value === 'bigint' ? Number(value) : value
			)
		}
	};
}