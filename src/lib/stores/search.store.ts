import { writable } from "svelte/store";

export const searchOpen = writable(false);

export const openSearch = () => searchOpen.set(true);
