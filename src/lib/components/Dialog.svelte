<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	let dialog: HTMLDialogElement
	export let open = false

	const dispatch = createEventDispatcher()

	export function show() {
		dialog.showModal()
	}

	export function close(e: Event | null) {
		if (e) e.preventDefault()
		dialog.close()
		dispatch('close')
	}

	function handleClickOutside(e: Event) {
		if (e.target === dialog) close(null)
	}
</script>

<dialog bind:this={dialog} {open} on:mouseup={handleClickOutside}>
	<article>
		<a href="#close" on:click={close} on:keypress={close} aria-label="Close" class="close" />
		<slot />
	</article>
</dialog>
