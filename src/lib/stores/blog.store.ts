import { writable } from "svelte/store";

export type PersonalPosts = boolean;
export const personalPosts = writable<PersonalPosts>(false);
