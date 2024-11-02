import db from '$lib/db/index'
import { luShips } from '$lib/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const ships = await db.select().from(luShips)

	return {
		statusCode: 200,
		body: {
			ships
		}
	};
}