---
title: My website
slug: my-website
date: 2022-01-5
description: "My first blog post, talking about the website construction"
tags: [Svelte, Tailwind]
---

_[Esse artigo foi traduzido pelo gpt]_

<script lang="ts">
  import SVG from '$lib/components/Base/AppSVG.svelte';
  import { Link } from 'dssoca';
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

## Sumário

## Introdução

Oi, leitor. Primeiro, eu quero agradecer **você** por estar aqui. Segundo, eu preciso agradecer ao <Link href="https://www.puruvj.dev/">PuruVJ</Link>, ao <Link href="https://fantinel.dev/">Matt Fantinel</Link> e ao <Link href="https://www.zenorocha.com/">Zeno Rocha</Link>, que me inspiram (e principalmente, me ajudam) neste site.

Ah, e deixa eu dizer que este não é meu primeiro site pessoal. Provavelmente é o terceiro ou quarto. Você pode ver o último <Link href="https://old.passoca.com.br">aqui</Link>, mas não julgue. Eu fiz com **React** (enquanto eu estava aprendendo) e **p5.js**. Este, por outro lado, foi feito com <Link href="https://kit.svelte.dev/">SvelteKit</Link> e <Link href="https://tailwindcss.com/">Tailwind CSS</Link>. Eu até tentei com <Link href="https://nuxtjs.org/">NuxtJS</Link>, inclusive eu fiz, mas decidi migrar para **Svelte** porque é mais rápido, mais fácil e é uma skill nova para eu aprender!

## As cores 🎨

Bom, verde é minha cor favorita, então eu coloquei ela como a principal aqui. Claro que não é tão simples assim. Eu procuro o melhor verde do mundo há eras, então, se você não consegue decidir uma cor, eu juro: é completamente compreensível.

No começo, eu fazia todos os sites com tema escuro. Mas a gente sabe que existe gente que não gosta, então eu fiz um tema branco. E, só pela brincadeira, um tema “coffee”.

{#each colorThemes as theme}

  <div class="label">
    {#if ['light','dark'].includes(theme.name)}
      <Icon src={theme.icon} size="23" />
    {:else}
      <SVG name="coffee" width="23" height="23"/>
    {/if}

    cores do tema:

  </div>

  <div class="colors-show">
    {#each theme.colors as color}
      <div
        class="color"
        style="background-color: {color}"
        on:click={() => copy(color)}
        on:keydown={() => copy(color)}
      >
        <span class="flex gap-2">{color} <Icon src={Duplicate} size="23" /></span>
      </div>
    {/each}
  </div>
{/each}

## O layout 📐

Quando eu tinha 14~16 anos, eu descobri que eu gostava muito de **Photoshop**, e eu tentei ser **designer**. Mas quando as coisas começaram a ficar mais difíceis e eu vi alguns designs realmente profissionais, eu só aceitei que eu não iria tão longe nisso e, sendo honesto comigo mesmo, eu nem queria. Sim, história triste.

Mas eu achei algo ainda melhor do que design: fazer o design acontecer! Eu acredito que meu “background de designer” me trouxe algumas habilidades gráficas para desenvolvimento web e ajudou a aumentar meu gosto por **frontend**. Então, tudo que eu tento fazer, eu tento fazer bonito. Pelo menos não feio, vamos combinar.

Ok, sem mais lero-lero: vamos direto ao ponto. Eu notei uma coisa quando eu estava olhando o site do Zeno. Se você vai fazer um site baseado em conteúdo por seções, é melhor **centralizar o conteúdo** na página e fazer **uma página para cada seção**. Eu digo isso porque eu não fiz assim e também não gostei do resultado. Parece que os conteúdos ficam muito “sozinhos” ou muito colados. Então, se o site vai ter menos conteúdo, eu acho melhor deixar ele mais apresentável e gostoso de navegar. Caso contrário, um layout simples que deixe o conteúdo mais leve de ler fica melhor.

Sobre o blog, eu deixei o layout o mais limpo possível, inspirado pelo <Link href="https://write.as/">write.as</Link>.

## O blog 🗒️

Definitivamente a parte mais difícil. Eu tive que usar coisas que eu nunca tinha usado e ainda não acabou. Eu basicamente misturei o blog do **PuruVJ** com o do **Matt Fantinel**. O PuruVJ fez **TUDO** sozinho (_sério, eu não duvido que ele considerou fazer o próprio Svelte_, <Link href="https://www.puruvj.dev/blog/how-i-created-personal-site-part-1">dá uma olhada</Link>). E o Matt, meu _camarada_ brasileiro, usa <Link href="https://mdsvex.pngwn.io/">mdsvex</Link>. Engraçado, porque eu decidi usar também 🤔, alguns segundos depois de ver o site dele — que coincidência!

## Fontes

<ul class="fonts">
  <li>
    <Link href="https://www.puruvj.dev/blog/how-i-created-personal-site-part-1"> 
      How I created my personal site - PuruVJ
    </Link>
  </li>
  <li>
    <Link href="https://fantinel.dev/blog-development-sveltekit/"> 
      How I built a blog with Svelte and SvelteKit - Matt Fantinel
    </Link>
  </li>
</ul>

<style lang="sass">
@import '../../../sass/breakpoints'

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
