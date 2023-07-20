<script lang="ts">
	import { signInWithGoogle } from '$lib/firebase/client'
</script>

<p>Welcome! This is a demo app for SvelteKit and Firebase. You can sign in</p>
<nav class="grid">
	<ul>
		<li>
			<button on:click={signInWithGoogle}>Sign in with Google</button>
		</li>
	</ul>
</nav>
