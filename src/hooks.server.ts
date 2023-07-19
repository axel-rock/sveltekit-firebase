import type { Handle } from '@sveltejs/kit'
import {
	auth
	// firestore
} from '$lib/firebase/admin.server'
import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth'

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies } = event

	const sessionCookie = cookies.get('__session')

	if (sessionCookie) {
		try {
			let user: DecodedIdToken | UserRecord | null = await auth.verifySessionCookie(sessionCookie)
			user = user ? await auth.getUser(user.uid) : null
			// await auth.setCustomUserClaims(user.uid, { admin: true })
			event.locals.user = user?.toJSON() as UserRecord
		} catch (e) {
			cookies.set('token', '', { maxAge: -1 })
		}
	}

	return resolve(event)
}
