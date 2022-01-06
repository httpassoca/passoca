---
title: My website
slug: my-website
date: 2022-01-5
description: "Test description"
tags: [Svelte, Tailwind]
---


Hi, reader. First, I want to appreciate **you** for being here. Second, I need to say thanks to [PuruVJ](https://www.puruvj.dev/), [Matt Fantinel](https://fantinel.dev/) and [Zeno Rocha](https://www.zenorocha.com/) that inspire (and principally, help) me in this website.

Ah, now let me tell that this isn't my first personal site. Probably is the third or fourth. You can see the last [here](https://old.passoca.com.br), but dont judge. I did it with **React** (while I learn it) and **p5.js**. This was made with [SvelteKit](https://kit.svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/). I did try with [NuxtJS](https://nuxtjs.org/), actually I made it, but decide migrate to **Svelte** because it is faster, easier and a new skill to learn!

## The colors 🎨

Well, green is my favorite color, so I made it the main. Of course, not easy like this. I've been looking for the best green in the world since ages ago, so if you can't decide your color, I swear, it is comprehensible. In the beggining, I used to create all websites in dark themes. But we know that exist people that don't like it , so I did a white theme. And just for fun, a coffee theme.


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

## The layout 📐

So, when I had 14~16 years I discovered that I really liked **Photoshop**, and I tried to be a **designer**. But when the things starts to get harder and I saw some really professional designs, I just accept that I wouldn't go that far and, being honest with myself, I didn't want it. Yes sad story.

But I found something better than design, making design happen! I believe that my "desginer" background brought me some graphic skills to web development and increase my taste for **frontend**. So everything I try to do, I try let it beautiful. At least not ugly, c'mon.

Okay, no more lero-lero, lets get straight to the point. I noticed something when was looking to Zeno's website. If you will do a website based on content in sections, is better to **center the content** in the page and make **one page for each section**. I say because I didn't do it and didn't appreciate the result either. Seems like the contents are too alone or too close together. So, if the website is going to have less content, I think is better to make it more presentable and tasty to browse. Otherwise, a simple layout to make the content lighter to read looks better.

About the blog, I did the layout clear as possible, inspirated on [write.as](https://write.as/).

## The blog 🗒️

Definitively the hardest thing. I had to use things I've never used and it isn't over yet. I basically mixed **PuruVJ**'s and **Matt Fantinel** blog. PuruVJ did **EVERYTHING** by itself (*seriously, I don't doubt he considered do his own Svelte,* [check it](https://www.puruvj.dev/blog/how-i-created-personal-site-part-1)). And Matt, my brazilian *camarada*, uses [mdsvex](https://mdsvex.pngwn.io/). Strange, because I decide to use too 🤔, a few seconds after seeing him website, what a coincidence!



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

