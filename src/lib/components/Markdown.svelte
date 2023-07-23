<script lang="ts">
	import { marked } from 'marked'
	export let raw: string = ''
	export let showTableOfContents: boolean = true
	export let openLinksInNewTab: boolean = true

	type Link = {
		anchor: string
		level: number
		text: string
	}

	let renderer = new marked.Renderer()
	let toc: Link[] = []
	renderer.heading = function (text: string, level: number, raw: string) {
		let anchor = raw.toLowerCase().replace(/[^\w]+/g, '-')
		toc.push({
			anchor: anchor,
			level: level,
			text: text
		})
		return '<h' + level + ' id="' + anchor + '">' + text + '</h' + level + '>\n'
	}

	function addTargetBlankToLinks(string: string) {
		return string.replace(/<a /g, '<a target="_blank" ')
	}
</script>

{#await marked(raw, { renderer, mangle: false, headerIds: false }) then html}
	<div class={showTableOfContents ? 'page-with-sidebar' : ''}>
		{#if showTableOfContents}
			<aside>
				<details open>
					<summary>Table of content</summary>
					<nav>
						<ul>
							{#each toc as link}
								<li>
									<a href="#{link.anchor}" data-tab={link.level}>{link.text}</a>
								</li>
							{/each}
						</ul>
					</nav>
				</details>
			</aside>
		{/if}
		<div role="document">
			{@html openLinksInNewTab ? addTargetBlankToLinks(html) : html}
		</div>
	</div>
{/await}

<style>
	a[data-tab='1'] {
		margin-left: 0;
	}

	a[data-tab='2'] {
		margin-left: 1rem;
	}
</style>
