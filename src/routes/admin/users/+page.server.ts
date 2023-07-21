import { addCustomClaims, auth, firestore } from '$lib/firebase/admin.server'
import { fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { stripe } from '$lib/server/stripe'

export const load = (async () => {
	const refs = await firestore.collection('users').get()
	const users = refs.docs.map((doc) => doc.data())
	const products = await stripe.products.list()
	return { users, products }
}) satisfies PageServerLoad

export const actions = {
	addAdmin: async ({ request, locals }) => {
		const data = await request.formData()
		const email = data.get('email')
		const user = await auth.getUserByEmail(email as string).catch(() => null)

		if (!user) return fail(400, { success: false, email, error: 'User not found' })

		try {
			await addCustomClaims(user, { admin: true })
			return { success: true }
		} catch (error) {
			return fail(400, { success: false, email, error })
		}
	}
}
