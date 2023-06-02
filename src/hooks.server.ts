import type { Handle } from '@sveltejs/kit'
import { auth, firestore } from '$lib/firebase/admin.server'
import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth'

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies } = event

	const sessionCookie = cookies.get('__session')

	if (sessionCookie) {
		try {
			// let user: DecodedIdToken | UserRecord | null = await auth.verifyIdToken(token ?)
			let user: DecodedIdToken | UserRecord | null = await auth.verifySessionCookie(sessionCookie)
			user = user ? await auth.getUser(user.uid) : null
			event.locals.user = user?.toJSON() as UserRecord

			console.log('user', user)
			// if (user) {
			// 	const accessSnapshot = await firestore.collection('access').doc(user.uid).get()
			// 	let access = accessSnapshot.data()
			// 	access = { ...access, public: true }
			// 	event.locals.access = access
			// }
		} catch (e) {
			cookies.set('token', '', { maxAge: -1 })
		}
	}

	if (event.url.pathname.startsWith('/admin') && !event.locals.access?.admin) {
		return Response.redirect('/', 307)
	}

	event.locals.access = { public: true, ...event.locals.access }

	return resolve(event)
}
