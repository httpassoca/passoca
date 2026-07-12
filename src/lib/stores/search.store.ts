import { writable } from "svelte/store";

export const searchOpen = writable(false);

export const openSearch = () => searchOpen.set(true);
export const closeSearch = () => searchOpen.set(false);
export const toggleSearch = () => searchOpen.update((open) => !open);
