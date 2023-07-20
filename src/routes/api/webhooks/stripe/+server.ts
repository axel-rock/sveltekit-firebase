import type { RequestHandler } from './$types'
import type { Stripe } from 'stripe'
import { stripe } from '$lib/server/stripe'
import { PRIVATE_STRIPE_WEBHOOK_SECRET } from '$env/static/private'

// stripe trigger customer.subscription.created

export const POST: RequestHandler = async ({ request }) => {
	const payload = await request.text()

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(
			payload,
			request.headers.get('stripe-signature') as string,
			PRIVATE_STRIPE_WEBHOOK_SECRET
		)
	} catch (err: any) {
		throw new Error(`Webhook Error: ${err.message}`)
	}

	// customer.subscription.created
	if (event.type === 'customer.subscription.created') {
		const subscription = event.data.object as Stripe.Subscription
		const customer = await stripe.customers.retrieve(subscription.customer as string)
		console.log(customer)
	}

	return new Response()
}
