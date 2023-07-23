import { dev } from '$app/environment'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth, type UserRecord } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
// import { getStorage } from 'firebase-admin/storage'
import { PUBLIC_FIREBASE_PROJECTID, PUBLIC_FIREBASE_STORAGEBUCKET } from '$env/static/public'

import {
	PRIVATE_FIREBASE_ADMIN_CLIENT_EMAIL,
	PRIVATE_FIREBASE_ADMIN_KEY
} from '$env/static/private'

function makeApp() {
	const apps = getApps()

	if (apps.length > 0) {
		return apps[0]
	}

	const app = initializeApp(
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
			: undefined,
		PUBLIC_FIREBASE_PROJECTID
	)
	const firestore = getFirestore(app)
	firestore.settings({ ignoreUndefinedProperties: true })
	return app
}

export const firebase = makeApp()
export const firestore = getFirestore(firebase)
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
	await syncUserAuth(user)
}

export const syncUserAuth = async (user: UserRecord | string) => {
	user = await auth.getUser(typeof user === 'string' ? user : user.uid)
	await firestore.collection('users').doc(user.uid).set(user.toJSON(), { merge: false })
}
