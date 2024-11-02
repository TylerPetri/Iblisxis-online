import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
// import { eq } from 'drizzle-orm';
import { luShips, players } from './db/schema';
  
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const playerSeeds: typeof players.$inferInsert[] = [{ name: 'Jabami'}, { name: 'Kuroko' }]
  const shipSeeds: typeof luShips.$inferInsert[] = [
    {
      name: 'aircraftCarrier',
      size: 5,
      color: 'orange'
    },
    {
      name: 'battleship',
      size: 4,
      color: 'red'
    },
    {
      name: 'cruiser',
      size: 3,
      color: 'grey'
    },
    {
      name: 'submarine',
      size: 3,
      color: 'green'
    },
    {
      name: 'destroyer',
      size: 2,
      color: 'purple'
    },
  ]

  await db.insert(players).values(playerSeeds).onConflictDoNothing()
  console.log('New users created!')
  await db.insert(luShips).values(shipSeeds).onConflictDoNothing()
  console.log('New ships created!')

  const users = await db.select().from(players);
  console.log('Getting all users from the database: ', users)
  const ships = await db.select().from(luShips)
  console.log('Getting all ships from the database: ', ships)

  // await db
  //   .update(players)
  //   .set({
  //     email: 'jabami@play.co',
  //   })
  //   .where(eq(players.name, user.name));
  // console.log('User info updated!')

  // await db.delete(players).where(eq(players.name, user.name));
  // console.log('User deleted!')
}

main();
