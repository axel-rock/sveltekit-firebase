import type { RequestHandler } from './$types'
import type { Stripe } from 'stripe'
import { stripe } from '$lib/stripe/stripe.server'
import { PRIVATE_STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import { addCustomClaims, auth } from '$lib/firebase/admin.server'

type SubscriptionWithPlan = Stripe.Subscription & { plan: Stripe.Plan }

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
	// customer.subscription.deleted
	// customer.subscription.paused
	// customer.subscription.resumed
	// customer.subscription.updated

	// customer.subscription.created
	switch (event.type) {
		case 'customer.subscription.created':
		case 'customer.subscription.updated':
		case 'customer.subscription.resumed':
			updateSubscription(event.data.object as SubscriptionWithPlan)
			break
		case 'customer.subscription.deleted':
		case 'customer.subscription.paused':
			updateSubscription(event.data.object as SubscriptionWithPlan)
			break
	}

	return new Response()
}

async function updateSubscription(subscription: SubscriptionWithPlan) {
	const customer = (await stripe.customers.retrieve(
		subscription.customer as string
	)) as Stripe.Customer
	const user = await auth.getUser(customer.metadata.uid)
	const product = await stripe.products.retrieve(subscription.plan.product as string)
	const claim = product.metadata.claim as string

	if (claim) {
		await addCustomClaims(user, { [claim]: subscription.status })
	}
	// if (subscription.status === 'active')
	// await addCustomClaims(user, { plan: subscription.plan.product as string })
	// else await removeCustomClaim(user, 'plan')
	console.log({ subscription, customer, user }, { plan: subscription.plan.product as string })
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
