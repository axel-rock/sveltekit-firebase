<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData, PageData } from './$types'

	export let data: PageData

	export let form: ActionData
</script>

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Email</th>
			<th>Admin</th>
			{#each data.products.data as product}
				{@const claim = product.metadata?.claim}
				{#if claim}
					<th>{product.name}</th>
				{/if}
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data.users as user}
			<tr>
				<td>{user.displayName}</td>
				<td>{user.email}</td>
				<td>{user.customClaims?.admin ? 'Yes' : 'No'}</td>

				{#each data.products.data as product}
					{@const claim = product.metadata?.claim}
					{#if claim}
						<td class="claim">
							{#if user.customClaims && user.customClaims[claim]}
								<span class={user.customClaims[claim]}>{user.customClaims[claim]}</span>
							{/if}
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<form method="POST" action="?/addAdmin" use:enhance>
	<label for="email">Add a new admin</label>
	<input type="email" name="email" id="email" placeholder="email@admin.com" />
	<button type="submit">Add</button>
</form>

{#if form?.success}
	<p>Successfully added as admin</p>
{:else if form?.error}
	<p>{form.error}</p>
{/if}

<style>
	.claim {
		text-transform: capitalize;

		& .active {
			color: var(--form-element-valid-border-color);
		}
	}
</style>
