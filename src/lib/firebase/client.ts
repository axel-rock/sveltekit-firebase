import { goto } from '$app/navigation'
import {
	PUBLIC_FIREBASE_APIKEY,
	PUBLIC_FIREBASE_APPID
	// PUBLIC_FIREBASE_MEASUREMENTID
	,
	PUBLIC_FIREBASE_AUTHDOMAIN,
	PUBLIC_FIREBASE_MESSAGINGSENDERID,
	PUBLIC_FIREBASE_PROJECTID,
	PUBLIC_FIREBASE_STORAGEBUCKET
} from '$env/static/public'
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { GoogleAuthProvider, signOut as _signOut, getAuth, signInWithPopup } from 'firebase/auth'
import {
	doc as _doc,
	getDoc as _getDoc,
	collection,
	getDocs,
	getFirestore,
	onSnapshot,
	query,
	type QueryConstraint
} from 'firebase/firestore'
import { readable } from 'svelte/store'

export const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_APIKEY,
	authDomain: PUBLIC_FIREBASE_AUTHDOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECTID,
	storageBucket: PUBLIC_FIREBASE_STORAGEBUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGINGSENDERID,
	appId: PUBLIC_FIREBASE_APPID
	// measurementId: PUBLIC_FIREBASE_MEASUREMENTID
}

export const makeApp: () => FirebaseApp = () => {
	if (getApps().length) return getApp()
	return initializeApp(firebaseConfig)
}

export const app = makeApp()
export const firestore = getFirestore(app)
export const auth = getAuth(app)
export const db = firestore

export const getDoc = async (path: string, ...pathSegments: string[]) => {
	const snapshot = await _getDoc(_doc(db, path, ...pathSegments))
	return {
		id: snapshot.id,
		ref: snapshot.ref,
		...snapshot.data()
	}
}

export const queryCollection = async (ref: string, ...queries: QueryConstraint[]) => {
	const snapshots = await getDocs(query(collection(db, ref), ...queries))
	return snapshots.docs.map((snapshot) => {
		return {
			id: snapshot.id,
			ref: snapshot.ref,
			...snapshot.data()
		}
	})
}

export const queryCollectionAsReadable = (ref: string, ...queries: QueryConstraint[]) =>
	readable(null, (set) => {
		const q = query(collection(db, ref), ...queries)
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const docs = querySnapshot.docs.map((snapshot) => {
				return {
					id: snapshot.id,
					ref: snapshot.ref,
					...snapshot.data()
				}
			})
			set(docs as any)
		})

		return function stop() {
			unsubscribe()
		}
	})

export const newRef = async (ref: string) => _doc(collection(db, ref))

export const signInWithGoogle = async () => {
	const credentials = await signInWithPopup(auth, new GoogleAuthProvider())
	const token = await credentials.user?.getIdToken(true)
	await fetch('/api/auth', {
		method: 'POST',
		body: JSON.stringify({ token })
	})
	document.location.reload()
}

export const signOut = async () => {
	await _signOut(auth)
	await fetch('/api/auth', {
		method: 'DELETE'
	})
	await goto('/')
	document.location.reload()
}
