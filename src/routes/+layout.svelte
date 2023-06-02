<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
	let { user, access } = data
</script>

<header>
	<h1>Logo</h1>
	<nav>
		<a href="/">Home</a>
		{#if user}
			<a href="/user">{user?.displayName}</a>
		{:else}
			<a href="/user">Login</a>
		{/if}
	</nav>
</header>

<main>
	<slot />
</main>

<footer>
	<a href="https://github.com/axel-rock/sveltekit-firebase" target="_blank" rel="noreferrer"
		>GitHub</a
	>
</footer>

<style global>
	@import '../css/app.css';
</style>
