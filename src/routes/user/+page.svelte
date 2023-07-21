<script lang="ts">
	import type { PageData } from './$types'
	import type { UserRecord } from 'firebase-admin/auth'
	import { signInWithGoogle, signOut } from '$lib/firebase/client'
	import SignIn from '$lib/components/SignIn.svelte'

	export let data: PageData
	let user: UserRecord = data.user
</script>

{#if user}
	<hgroup>
		<h1>{user.displayName}</h1>
		<p>{user.email}</p>
	</hgroup>

	<div class="flex">
		<div>
			<button on:click={signOut} class="contrast">Logout</button>
		</div>
	</div>
{:else}
	<SignIn />
{/if}
