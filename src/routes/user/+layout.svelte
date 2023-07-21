<script lang="ts">
	import type { LayoutData } from './$types'

	export let data: LayoutData

	const { user } = data
</script>

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
