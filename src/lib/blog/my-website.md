---
title: My website
slug: my-website
date: 2022-01-5
description: "Test description"
tags: [Svelte, Tailwind]
---


Hi, reader. First, I want to appreciate **you** for being here. Second, I need to say thanks to [PuruVJ](https://www.puruvj.dev/) and [Matt Fantinel](https://fantinel.dev/) that inspire (and principally, help) me in this website.

Ah, now let me tell that this isn't my first personal site. Probably is the third or fourth. You can see the last [here](https://old.passoca.com.br), but dont judge. I did it with **React** (while I learn it) and **p5.js**. This was made with [SvelteKit](https://kit.svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/). I did try with [NuxtJS](https://nuxtjs.org/), actually I made it, but decide migrate to **Svelte** because it is faster, easier and a new skill to learn!

## 🎨 The colors

Well, green is my favorite color, so I made it the main. In the beggining, I used to create all websites in dark themes. But we know that exist people that don't like it , so I did a white theme. And just for fun, a coffee theme.


{#each colorThemes as theme}

  <div class="label">
    {#if ['light','dark'].includes(theme.name)}
      <Icon src={theme.icon} size="23" />
    {:else}
      <SVG src="/icons/coffee.svg" width="23" height="23"/>
    {/if}

    theme colors:
  </div>


  <div class="colors-show">
    {#each theme.colors as color}
      <div
        class="color"
        style="background-color: {color}"
        on:click={() => copy(color)}
      >
        <span class="flex gap-2">{color} <Icon src={Duplicate} size="23" /></span>
      </div>
    {/each}
  </div>

{/each}


<script lang="ts">
  import { Moon, Sun, Duplicate } from "svelte-hero-icons";
  import SVG from "svelte-inline-svg";
  import Icon from "svelte-hero-icons/Icon.svelte";
  const copy = async (color: string): string => {
    await navigator.clipboard.writeText(color);
  }
  const colorThemes = [
    {
      name: 'dark',
      icon: Moon,
      colors: [
      "#66EF73",
      "#100F10",
      "#E0E0E0",
      "#AAAAAA",
    ]},
    {
      name: 'light',
      icon: Sun,
      colors: [
      "#66EF73",
      "#FEFEFE",
      "#000000",
      "#AAAAAA",
    ]},
    {
      name: 'coffee',
      colors: [
      "#6A461E",
      "#F9DEC9",
      "#000000",
      "#9E9E9E",
    ]}
  ]
</script>

<style lang="sass">
@import '../../sass/breakpoints'

.label
  display: flex
  align-items: center
  gap: 8px
  margin-top: 8px
  :global
    p
      margin-top: unset !important

.colors-show
  display: grid
  align-items: center
  gap: 15px
  margin: 20px 0
  grid-template-columns: repeat(1, 1fr)
  @include screen-md
    grid-template-columns: repeat(4, 1fr)


.color
  padding: 12px 20px
  display: grid
  cursor: pointer
  place-items: center
  color: rgba(0,0,0,.3)
  transition: all .3s
  font-size: 1rem
  &:hover
    color: unset
    background-color: rgba(0,0,0,.1) !important
  &:active
    background-color: rgba(0,0,0,.0) !important
    transform: translateY(5px)
</style>

