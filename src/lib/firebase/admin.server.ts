import { dev } from '$app/environment'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth, UserRecord } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'
import { PUBLIC_FIREBASE_PROJECTID, PUBLIC_FIREBASE_STORAGEBUCKET } from '$env/static/public'

import {
	PRIVATE_FIREBASE_ADMIN_KEY,
	PRIVATE_FIREBASE_ADMIN_CLIENT_EMAIL
} from '$env/static/private'

function makeApp() {
	const apps = getApps()
	if (apps.length > 0) {
		return apps[0]
	}

	return initializeApp(
		dev
			? {
					credential: cert({
						privateKey: PRIVATE_FIREBASE_ADMIN_KEY,
						clientEmail: PRIVATE_FIREBASE_ADMIN_CLIENT_EMAIL,
						projectId: PUBLIC_FIREBASE_PROJECTID
					}),
					projectId: PUBLIC_FIREBASE_PROJECTID,
					databaseURL: `https://${PUBLIC_FIREBASE_PROJECTID}.firebaseio.com`,
					storageBucket: PUBLIC_FIREBASE_STORAGEBUCKET
			  }
			: {},
		PUBLIC_FIREBASE_PROJECTID
	)
}

export const firebase = makeApp()
export const firestore = getFirestore(firebase)
firestore.settings({ ignoreUndefinedProperties: true })
export const auth = getAuth(firebase)
// export const bucket = getStorage(firebase).bucket(PUBLIC_FIREBASE_STORAGEBUCKET)

export const getUserFromSessionCookie = async (token: string) => {
	const user = token ? await auth.verifySessionCookie(token) : null
	if (!user) return null
	return auth.getUser(user.uid)
}

export const addCustomClaims = async (user: UserRecord, claims: Record<string, unknown>) => {
	await auth.setCustomUserClaims(user.uid, {
		...user.customClaims,
		...claims
	})
	await firestore
		.collection('users')
		.doc(user.uid)
		.set(
			{
				...user.customClaims,
				...claims
			},
			{ merge: true }
		)
}
