import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, route, params }) => {
  console.log('slug')
  console.log('url', url)
	console.log('route', route)
	console.log('params', params)

  // match/[id]... ie match/134959345
  // can get placements, players, etc

  // but before that, there's a href with action
  // play/online/new?...
}