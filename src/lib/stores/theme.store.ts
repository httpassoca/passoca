import { writable } from "svelte/store";
import { browser } from "$app/environment";

export type Theme = "dark" | "light" | "coffee" | "dracula" | "tokyo-night";

let initialized = false;
export const theme = writable<Theme>("dark");

theme.subscribe((val) => {
  if (!browser) return;
  if (!initialized) return (initialized = true);
  document.body.dataset.theme = val;
  localStorage.setItem("theme", val);
});
