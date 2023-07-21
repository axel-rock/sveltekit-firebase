import { redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { PRIVATE_STRIPE_SECRET_KEY } from '$env/static/private'
import { PUBLIC_FIREBASE_AUTHDOMAIN } from '$env/static/public'
import { addCustomClaims } from '$lib/firebase/admin.server'
import type { UserRecord } from 'firebase-admin/auth'
import Stripe from 'stripe'

const url = dev ? 'http://localhost:5173' : `https://${PUBLIC_FIREBASE_AUTHDOMAIN}`
export const checkoutSessionParameter = 'checkoutSession'

export const stripe = new Stripe(PRIVATE_STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15'
})

export const checkout = async (user: UserRecord, price: string) => {
	const customer = await getCustomer(user)

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: price as string,
				quantity: 1
			}
		],
		customer: customer.id,
		customer_update: {
			address: 'auto'
		},
		mode: 'subscription',
		success_url: `${url}/pricing?${checkoutSessionParameter}={CHECKOUT_SESSION_ID}`,
		cancel_url: `${url}/pricing`,
		automatic_tax: { enabled: true }
	})

	throw redirect(303, session.url as string)
}

export const getCustomer = (user: UserRecord) => {
	if (user.customClaims?.stripe_customer_id) {
		return stripe.customers.retrieve(user.customClaims.stripe_customer_id as string)
	} else {
		return createCustomer(user)
	}
}

const createCustomer = async (user: UserRecord) => {
	const customer = await stripe.customers.create({
		name: user.displayName,
		email: user.email,
		metadata: {
			uid: user.uid
		}
	})
	await addCustomClaims(user, { stripe_customer_id: customer.id })
	return customer
}

export const getPortal = async (user: UserRecord) => {
	if (!user.customClaims?.stripe_customer_id) throw new Error('No Stripe customer ID found.')
	return await stripe.billingPortal.sessions.create({
		customer: user.customClaims.stripe_customer_id as string
	})
}

export const openPortal = async (user: UserRecord) => {
	const portal = await getPortal(user)
	throw redirect(303, portal.url as string)
}
