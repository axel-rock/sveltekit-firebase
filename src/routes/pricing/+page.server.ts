import { checkout, checkoutSessionParameter, stripe } from '$lib/server/stripe'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
	const products_list = await stripe.products.list({
		active: true
	})
	const products = await Promise.all(
		products_list.data.map(async (product) => {
			const price = await stripe.prices.retrieve(product.default_price as string)
			return {
				...product,
				price
			}
		})
	)

	// Get session from query string
	// console.log(url)
	let checkoutSession

	if (url.searchParams.has(checkoutSessionParameter)) {
		checkoutSession = await stripe.checkout.sessions.retrieve(
			url.searchParams.get(checkoutSessionParameter) as string
		)
	}

	return {
		products,
		checkoutSession
	}
}) satisfies PageServerLoad

export const actions = {
	checkout: async ({ request, locals }) => {
		const data = await request.formData()
		const price = data.get('price') as string
		const { user } = locals

		return checkout(user, price)
	}
} satisfies Actions
