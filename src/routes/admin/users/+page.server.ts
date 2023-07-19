import { auth, firestore } from '$lib/firebase/admin.server'
import { fail } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const refs = await firestore.collection('users').get()
	const users = refs.docs.map((doc) => doc.data())
	return { users }
}) satisfies PageServerLoad

export const actions = {
	addAdmin: async ({ request, locals }) => {
		const data = await request.formData()
		const email = data.get('email')
		const user = await auth.getUserByEmail(email as string).catch(() => null)

		if (!user) return fail(400, { success: false, email, error: 'User not found' })

		try {
			await auth.setCustomUserClaims(user.uid, { admin: true })
			return { success: true }
		} catch (error) {
			return fail(400, { success: false, email, error })
		}
	}
}
