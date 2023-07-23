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
		close(null)
	}
</script>

<dialog bind:this={dialog} {open}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="clickArea" on:click={handleClickOutside} on:keyup={handleClickOutside}></div>
	<article>
		<a href="#close" on:click={close} on:keypress={close} aria-label="Close" class="close"/>
		<slot />
	</article>
</dialog>

<style>
	.clickArea {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
	}
</style>