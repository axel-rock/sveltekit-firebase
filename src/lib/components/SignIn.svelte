<script lang="ts">
	import { signInWithGoogle } from '$lib/firebase/client'
	import { page } from '$app/stores'
</script>

<h3>Sign in</h3>

{#if $page.url.searchParams.get('message')}
	<p>{$page.url.searchParams.get('message')}</p>
{/if}
<p>We will provide more ways to authenticate soon, stay tuned.</p>

<footer>
	<nav class="center">
		<ul>
			<li>
				<button on:click={signInWithGoogle}>Sign in with Google</button>
			</li>
		</ul>
	</nav>
</footer>

<style>
	.center {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
</style>
