import type { SvelteComponent } from 'svelte'
import { writable, type Writable } from 'svelte/store'

export const signInDialog: Writable<null | SvelteComponent> = writable(null)
