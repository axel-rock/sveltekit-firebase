<script lang="ts">
	import readme from '/README.md?raw'
	import Markdown from '$lib/components/Markdown.svelte'
</script>

<Markdown raw={readme} showTableOfContents={true} />
