<script lang="ts">
	let dialog: HTMLDialogElement
	export let open = false

	export function show() {
		dialog.showModal()
	}

	export function close(e: Event | null) {
		if (e) e.preventDefault()
		dialog.close()
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
