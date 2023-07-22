import { getPortal, stripe } from '$lib/stripe/stripe.server'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	return {
		awaited: {
			portal: getPortal(locals.user)
		}
	}
}) satisfies PageServerLoad
