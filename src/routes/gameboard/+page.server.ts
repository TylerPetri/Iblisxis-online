import { handler } from '../../../netlify/functions/getShips'

export async function load() {
  return await handler()
}