import { getPortal, stripe } from '$lib/server/stripe'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	return {
		awaited: {
			portal: getPortal(locals.user)
		}
	}
}) satisfies PageServerLoad
