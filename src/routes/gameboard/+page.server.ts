import { handler } from '$lib/server/queries/getShips'

export async function load() {
  return await handler()
}