<script lang="ts">
	let dialog: HTMLDialogElement
	export let open = false

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
		<slot />
	</article>
</dialog>
