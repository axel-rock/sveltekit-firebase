import { addCustomClaims, auth, firestore, syncUserAuth } from '$lib/firebase/admin.server'
import { fail, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { stripe } from '$lib/stripe/stripe.server'

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
	},

	resetCustomClaims: async ({ request, locals }) => {
		const users = await auth.listUsers()
		await Promise.all(
			users.users.map(async (user) => {
				await auth.setCustomUserClaims(user.uid, user.customClaims?.admin ? { admin: true } : {})
				return syncUserAuth(user)
			})
		)
		return { success: true }
	}
} satisfies Actions
