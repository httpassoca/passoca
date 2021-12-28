import { writable } from "svelte/store";
import { browser } from '$app/env';

export type Theme = 'light' | 'dark' | 'coffee';

export const theme = writable<Theme>('dark');

let initialized = false;

theme.subscribe((val) => {
  if (!browser) return;
  // Don't do anything if its first value
  if (!initialized) return (initialized = true);

  const { dataset } = document.body;
  dataset.theme = val;

  localStorage.setItem('theme', val);
});
