<script lang="ts">
	import type { PageData } from './$types'
	import SignInDialog from '$lib/components/SignInDialog.svelte'
	export let data: PageData
	let { user } = data

	let signInDialog: SignInDialog
</script>

<header class="container">
	<a href="/" id="logo">SvelteKit Firebase</a>
	<nav>
		<ul>
			<li>
				<a href="/">Home</a>
			</li>
			{#if user}
				<li>
					<a href="/user" role="button">{user?.displayName}</a>
				</li>
			{:else}
				<li>
					<!-- <a href="/user" role="button">Login</a> -->
					<button on:click={() => signInDialog.show()}>Login</button>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<main class="container">
	<slot />
</main>

<footer class="container">
	<nav>
		<ul>
			<li>
				<a href="https://github.com/axel-rock/sveltekit-firebase" target="_blank" rel="noreferrer"
					>GitHub</a>
			</li>
		</ul>

		{#if user?.customClaims?.admin}
			<ul>
				<li>
					<a href="/admin/users">Admin</a>
				</li>
			</ul>
		{/if}
	</nav>
</footer>

<SignInDialog bind:this={signInDialog} />

<style global>
	@import '../css/app.css';

	#logo {
		color: var(--h1-color);
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: 400;
	}
</style>
