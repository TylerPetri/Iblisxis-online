import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const jabami = await prisma.players.upsert({
    where: { email: 'jabami@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Jabami',
    },
  })
  const kuroko = await prisma.players.upsert({
    where: { email: 'kuroko@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Kuroko',
    },
  })
  console.log({ jabami, kuroko })

  const ships = [{ name: 'aircraftCarrier', size: 5, color: 'orange' }, { name: 'battleship', size: 4, color: 'red' }, { name: 'cruiser', size: 3, color: 'grey' }, { name: 'submarine', size: 3, color: 'green' }, { name: 'destroyer', size: 2, color: 'purple' }]

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
    console.log({ ship })
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