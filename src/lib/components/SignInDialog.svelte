<script lang="ts">
	import { signInWithGoogle } from '$lib/firebase/client'

	export let open = false
	let dialog: HTMLDialogElement

	export function show() {
		dialog.showModal()
	}

	export function close() {
		dialog.close()
	}
</script>

<dialog bind:this={dialog} {open}>
	<article>
		<span on:click={close} on:keypress={close} aria-label="Close" class="close" />
		<p>Welcome! This is a demo app for SvelteKit and Firebase. You can sign in</p>
		<nav class="grid">
			<ul>
				<li>
					<button on:click={signInWithGoogle}>Sign in with Google</button>
				</li>
			</ul>
		</nav>
	</article>
</dialog>
