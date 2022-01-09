/// <reference types="@sveltejs/kit" />
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'svelte-inline-svg';
