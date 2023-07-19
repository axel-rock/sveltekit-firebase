<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
	let { user } = data
</script>

<header class="container">
	<a href="/" id="logo">SvelteKit Firebase</a>
	<nav>
		<ul>
			<li>
				<a href="/">Home</a>
			</li>
		</ul>
		{#if user}
			<li>
				<a href="/user" role="button">{user?.displayName}</a>
			</li>
		{:else}
			<li>
				<a href="/user" role="button">Login</a>
			</li>
		{/if}
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
	</nav>
</footer>

<style global>
	@import '../css/app.css';

	#logo {
		color: var(--h1-color);
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: 400;
	}
</style>
