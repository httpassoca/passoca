---
title: My website
slug: my-website
date: 2022-01-5
description: "My first blog post, talking about the website construction"
tags: [Svelte, Tailwind]
---

<script lang="ts">
  import SVG from '../components/Base/AppSVG.svelte';
  import Link from '../components/Base/AppLink.svelte';
  import { Moon, Sun, Duplicate } from "svelte-hero-icons";
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

Hi, reader. First, I want to appreciate **you** for being here. Second, I need to say thanks to <Link to="https://www.puruvj.dev/">PuruVJ</Link>, <Link to="https://fantinel.dev/">Matt Fantinel</Link> and <Link to="https://www.zenorocha.com/">Zeno Rocha</Link> who inspire (and principally, help) me in this website.

Ah, now let me tell that this isn't my first personal site. Probably is the third or fourth. You can see the last <Link to="https://old.passoca.com.br">here</Link>, but dont judge. I did it with **React** (while I was learning it) and **p5.js**. This one however, was made with <Link to="https://kit.svelte.dev/">SvelteKit</Link> and <Link to="https://tailwindcss.com/">Tailwind CSS</Link>. I did try with <Link to="https://nuxtjs.org/">NuxtJS</Link>, actually I even made it, but decided to migrate to **Svelte** because it is faster, easier and a new skill to learn for me!

## The colors 🎨

Well, green is my favorite color, so I made it the main here. Of course, not easy like this. I've been looking for the best green in the world since ages, so if you can't decide your color, I swear, it is completely comprehensible. In the beggining, I used to create all websites in dark themes. But we know that there exist people that don't like it , so I did a white theme. And just for fun, a coffee theme.


{#each colorThemes as theme}
  <div class="label">
    {#if ['light','dark'].includes(theme.name)}
      <Icon src={theme.icon} size="23" />
    {:else}
      <SVG name="coffee" width="23" height="23"/>
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

So, when I had 14~16 years old, I discovered that I really liked **Photoshop**, and I tried to be a **designer**. But when the things started to get harder and I saw some really professional designs, I just accept that I wouldn't go that far in it and, being honest with myself, I didn't want it. Yes sad story.

But I found something even better than design, making design happen! I believe that my "desginer" background brought me some graphic skills to web development and helped increase my taste for **frontend**. So everything I try to do, I try let it beautiful. At least not ugly, c'mon.

Okay, no more lero-lero, lets get straight to the point. I noticed something when was looking to Zeno's website. If you will do a website based on content in sections, is better to **center the content** in the page and make **one page for each section**. I say because I didn't do it and didn't appreciate the result either. Seems like the contents are too alone or too close together. So, if the website is going to have less content, I think is better to make it more presentable and tasty to browse. Otherwise, a simple layout to make the content lighter to read looks better.

About the blog, I did the layout as clear as possible, inspirated by <Link to="https://write.as/">write.as</Link>.

## The blog 🗒️

Definitively the hardest thing. I had to use things I've never used and it isn't over yet. I basically mixed **PuruVJ**'s and **Matt Fantinel** blog. PuruVJ did **EVERYTHING** by itself (*seriously, I don't doubt he considered to do his own Svelte,* <Link to="https://www.puruvj.dev/blog/how-i-created-personal-site-part-1">check it out</Link>). And Matt, my brazilian *camarada*, uses <Link to="https://mdsvex.pngwn.io/">mdsvex</Link>. Strange, because I decide to use too 🤔, a few seconds after seeing him website, what a coincidence!

## Fonts

<ul class="fonts">
  <li>
    <Link to="https://www.puruvj.dev/blog/how-i-created-personal-site-part-1"> 
      How I created my personal site - PuruVJ
    </Link>
  </li>
  <li>
    <Link to="https://fantinel.dev/blog-development-sveltekit/"> 
      How I built a blog with Svelte and SvelteKit - Matt Fantinel
    </Link>
  </li>
</ul>

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

