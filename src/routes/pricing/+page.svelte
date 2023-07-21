<script lang="ts">
	import type { PageData } from './$types'
	import { signInDialog } from '$lib/stores'
	import checkmark from '$lib/icons/checkmark.svg?raw'

	export let data: PageData

	const { products, user, checkoutSession } = data

	function readablePrice(price: any) {
		return (price.unit_amount / 100).toLocaleString(undefined, {
			style: 'currency',
			currency: price.currency.toUpperCase()
		})
	}

	function readableFrequency(price: any) {
		if (!price.recurring) return ''

		if (price.recurring.interval === 'month') {
			if (price.recurring.interval_count === 1) return '/month'
			return `/${price.recurring.interval_count} months`
		}
	}
</script>

<hgroup>
	<h1>Pricing</h1>
	<h2>Retrieved from Stripe Products for simplicity</h2>
</hgroup>

{#if checkoutSession?.status === 'complete'}
	<div class="success">
		{@html checkmark}

		<hgroup>
			<h2>Success</h2>
			<p>Thank you for your purchase!</p>
		</hgroup>
	</div>
{/if}

<section class="grid">
	{#each products as product}
		{@const claim = product.metadata?.claim}
		{@const current = user.customClaims && user.customClaims[claim] === 'active'}
		<article id={claim}>
			<hgroup>
				<h2>
					{product.name}
					<small role="button" class="outline secondary">{user.customClaims[claim]}</small>
				</h2>

				<p>
					{#if product.description}
						{product.description}
					{/if}
				</p>
			</hgroup>
			{#if product.price?.unit_amount}
				<p>
					{readablePrice(product.price)}{readableFrequency(product.price)}
				</p>
			{/if}

			<div class="flex">
				{#if user}
					<form method="POST" action="?/checkout">
						<input type="hidden" name="price" value={product.price.id} />
						<button type="submit">{product.price.recurring ? 'Subscribe' : 'Buy'}</button>
					</form>
				{:else}
					<div>
						<button
							on:click={() => {
								$signInDialog?.show()
							}}>Sign in to {product.price.recurring ? 'subscribe' : 'buy'}</button>
					</div>
				{/if}
			</div>
		</article>
	{/each}
</section>

<!-- <pre>
	<code>{JSON.stringify(data, null, 2)}</code>
</pre> -->

<style>
	.success {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;

		& svg {
			width: 3rem;
			height: 3rem;
			fill: var(--form-element-valid-border-color);
		}
	}

	article form,
	article button {
		margin-bottom: 0;
	}
</style>
