import prisma from '$lib/prisma'

export const handler = async () => {
	const allShips = await prisma.ships.findMany();

	return {
		statusCode: 200,
		body: JSON.stringify(allShips, (key, value) =>
			typeof value === 'bigint' ? value.toString() : value
		)
	};
};
