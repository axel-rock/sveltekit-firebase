<script lang="ts">
	import type { PageData } from './$types'
	import type { UserRecord } from 'firebase-admin/auth'
	import { signOut } from '$lib/firebase/client'
	import SignIn from '$lib/components/SignIn.svelte'

	export let data: PageData
	let user: UserRecord = data.user
</script>

{#if user}
	<form action="">
		{#if user.photoURL}
			<fieldset>
				<img src={user.photoURL} alt={user.displayName} class="avatar" />
			</fieldset>
		{/if}
		<fieldset>
			<label for="email">Email:</label>
			<input id="email" name="email" type="email" value={user.email} disabled />
			<span>You can't change your email as you logged in with Google</span>
		</fieldset>

		<fieldset>
			<details>
				<summary>View all my infos</summary>
				<pre>
					<code>{JSON.stringify(user, null, 2)}</code>
				</pre>
			</details>
		</fieldset>
	</form>

	<div class="flex">
		<div>
			<button on:click={signOut} class="contrast">Logout</button>
		</div>
	</div>
{:else}
	<SignIn />
{/if}

<style>
	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
	}
</style>
