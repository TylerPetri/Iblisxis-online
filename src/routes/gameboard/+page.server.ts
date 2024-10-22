import prisma from '$lib/prisma'

export async function load() {
  const allShips = await prisma.ships.findMany()

  return {statuscode: 200, body: JSON.stringify(allShips, (key,value) => typeof value === 'bigint' ? value.toString() : value)}
}