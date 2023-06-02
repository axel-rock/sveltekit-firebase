<script lang="ts">
	import type { PageData } from './$types'
	import type { User } from 'firebase/auth'
	import { signInWithGoogle, signOut } from '$lib/firebase/client'

	export let data: PageData
	let user: User = data.user
</script>

{#if user}
	<h1>{user.displayName}</h1>
	<p>{user.email}</p>

	<a href="/" on:click={signOut} class="button">Logout</a>
{:else}
	<a href="/" on:click={signInWithGoogle} class="button">Sign in with Google</a>
{/if}
