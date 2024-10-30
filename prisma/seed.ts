import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const jabami = await prisma.players.upsert({
    where: { name: 'Jabami' },
    update: {},
    create: {
      email: 'jabami@prisma.io',
      name: 'Jabami',
    },
  })
  const kuroko = await prisma.players.upsert({
    where: { name: 'Kuroko' },
    update: {},
    create: {
      email: 'kuroko@prisma.io',
      name: 'Kuroko',
    },
  })
  console.log({ jabami, kuroko })

  const ships = [{ name: 'aircraftCarrier', size: 5, color: 'orange', direction: 'horizontal', row: 3, col: 2 }, { name: 'battleship', size: 4, color: 'red', direction: 'horizontal', row: 1, col: 5 }, { name: 'cruiser', size: 3, color: 'grey', direction: 'horizontal', row: 4, col: 6 }, { name: 'submarine', size: 3, color: 'green', direction: 'horizontal', row: 7, col: 7 }, { name: 'destroyer', size: 2, color: 'purple', direction: 'horizontal', row: 3, col: 8 }]

  for (let i = 0; i < ships.length; i++) {
    const ship = await prisma.ships.upsert({
      where: { name: ships[i].name },
      update: {},
      create: {
        name: ships[i].name,
        size: ships[i].size,
        color: ships[i].color
      }
    })

    const playerShipPlacements = await prisma.player_ship_placements.upsert({
      where: {
        player_id: jabami.id,
        row: ships[i].row,
        col: ships[i].col
      },
      update: {},
      create: {
        ship_id: ship.id,
        row: ships[i].row,
        col: ships[i].col,
        player_id: jabami.id,
        direction: ships[i].direction
      }
    })
    console.log({ ship, playerShipPlacements })
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })