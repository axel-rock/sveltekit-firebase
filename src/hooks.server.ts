import type { Handle } from '@sveltejs/kit'
import {
	// addCustomClaims,
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
			// await addCustomClaims(user.uid, { admin: true })
			event.locals.user = user?.toJSON() as UserRecord
		} catch (e) {
			cookies.set('token', '', { maxAge: -1 })
		}
	}

	if (event.url.pathname.startsWith('/admin') && !event.locals.user?.customClaims?.admin) {
		const params = {
			action: 'login',
			continueTo: event.url.pathname,
			message: 'You must be an admin to access this page.'
		}
		return new Response('Redirect', {
			status: 303,
			headers: {
				Location: `/?${new URLSearchParams(params).toString()}`
			}
		})
	}

	if (event.url.pathname.startsWith('/user') && !event.locals.user) {
		const params = {
			action: 'login',
			continueTo: event.url.pathname,
			message: 'You must be logged in to access this page.'
		}
		return new Response('Redirect', {
			status: 303,
			headers: {
				Location: `/?${new URLSearchParams(params).toString()}`
			}
		})
	}

	return resolve(event)
}
