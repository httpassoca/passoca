---
title: test
slug: my-website
date: 2020-12-28
description: "Test description"
tags: [Meta]
---


# Welcome!

Hi, reader. First, I want to appreciate **you** for being here. Second, I need to say thanks to [PuruVJ](https://www.puruvj.dev/) and [Matt Fantinel](https://fantinel.dev/) that inspire (and principally, help) me in this website.

Ah, now let me tell that this isn't my first personal site. Probably is the third or fourth. You can see the last [here](https://old.passoca.com.br), but dont judge. I did it with **React** (while I learn it) and **p5.js**. This was made with [SvelteKit](https://kit.svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/). I did try with [NuxtJS](https://nuxtjs.org/), actually I made it, but decide migrate to **Svelte** because it is faster, easier and a new skill to learn!

## The colors

Well, green is my favorite color, so I made it the main. In the beggining, I used to create all websites in dark themes. But we know that exist people that don't like it , so I did a white theme. And just for fun, a coffee theme.

<div class="colors-show">
  <span style="background-color: #66EF73">#66EF73</span>
  <span style="background-color: #100F10">#100F10</span>
  <span style="background-color: #E0E0E0">#E0E0E0</span>
  <span style="background-color: #AAAAAA">#AAAAAA</span>
</div>
<div class="colors-show">
  <span style="background-color: #66EF73">#66EF73</span>
  <span style="background-color: #FEFEFE">#FEFEFE</span>
  <span style="background-color: #000000">#000000</span>
  <span style="background-color: #AAAAAA">#AAAAAA</span>
</div>
<div class="colors-show">
  <span style="background-color: #6A461E">#6A461E</span>
  <span style="background-color: #F9DEC9">#F9DEC9</span>
  <span style="background-color: #000000">#000000</span>
  <span style="background-color: #9E9E9E">#9E9E9E</span>
</div>

<style lang="sass">
.colors-show
  display: flex
  align-items: center
  gap: 15px
  margin: 20px 0

span
  width: 100px
  height: 100px
  display: grid
  place-items: center
  color: rgba(0,0,0,.1)
  transition: all .3s
  font-size: 1rem
  &:hover
    color: black
</style>
