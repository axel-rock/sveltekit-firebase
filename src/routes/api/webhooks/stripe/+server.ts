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

// switch (event.type) {
// 	case 'customer.subscription.created':
// 		const customerSubscriptionCreated = event.data.object;
// 		// Then define and call a function to handle the event customer.subscription.created
// 		break;
// 	case 'customer.subscription.deleted':
// 		const customerSubscriptionDeleted = event.data.object;
// 		// Then define and call a function to handle the event customer.subscription.deleted
// 		break;
// 	case 'customer.subscription.paused':
// 		const customerSubscriptionPaused = event.data.object;
// 		// Then define and call a function to handle the event customer.subscription.paused
// 		break;
// 	case 'customer.subscription.resumed':
// 		const customerSubscriptionResumed = event.data.object;
// 		// Then define and call a function to handle the event customer.subscription.resumed
// 		break;
// 	case 'customer.subscription.updated':
// 		const customerSubscriptionUpdated = event.data.object;
// 		// Then define and call a function to handle the event customer.subscription.updated
// 		break;
// 	case 'subscription_schedule.completed':
// 		const subscriptionScheduleCompleted = event.data.object;
// 		// Then define and call a function to handle the event subscription_schedule.completed
// 		break;
// 	case 'subscription_schedule.created':
// 		const subscriptionScheduleCreated = event.data.object;
// 		// Then define and call a function to handle the event subscription_schedule.created
// 		break;
// 	// ... handle other event types
// 	default:
// 		console.log(`Unhandled event type ${event.type}`);
// }
