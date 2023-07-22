<script lang="ts">
	import type { LayoutData } from './$types'

	export let data: LayoutData

	const { user } = data
</script>

<hgroup>
	<h1>My Account</h1>
	<h2>{user.displayName || user.email}</h2>
</hgroup>

<nav>
	<ul>
		<li>
			<a href="/user">Infos</a>
		</li>
		{#if user.customClaims && user.customClaims.stripe_customer_id}
			<li>
				<a href="/user/billing">Subscription</a>
			</li>
		{/if}
	</ul>
</nav>

<slot />
