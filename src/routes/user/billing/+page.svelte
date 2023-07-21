<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
</script>

<h1>Billing</h1>

<p>You can fully manage your plans on a Stripe Portal</p>

{#await data.awaited.portal}
	<button aria-busy="true" class="secondary">Loading Stripe Portal</button>
{:then portal}
	<a href={portal.url} target="_blank" role="button" class="contrast">Manage my subscription</a>
{/await}

<style>
	button {
		display: inline-block;
	}
</style>
