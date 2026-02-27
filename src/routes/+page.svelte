<script lang="ts">
  import Content from "$lib/components/Base/AppContent.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  import AppSvg from "$lib/components/Base/AppSVG.svelte";
  import SpotifyMusic from "$lib/components/SpotifyMusic.svelte";
  import { books, games, socials, trips } from "$lib/data/misc";
  import { theme } from "$lib/stores/theme.store";
  import { m } from "$lib/paraglide/messages";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let { music } = data;
</script>

<Content page>
  <div class="info">
    <h1 class="font-boston mb-2">{m.home_title()}</h1>
    <p class="text-base">
      {m.home_intro()}
    </p>
    <p class="text-base">
      {m.home_resume()}
      <a
        target="_blank"
        href="https://www.notion.so/passoca/Curriculum-Vitae-Rafael-Freitas-f4e9a131885846cabdd6c0ab658f476d?pvs=4"
        title="resume">↗</a
      >
    </p>
  </div>
  <div
    class="flex flex-col items-center md:items-start md:flex-row gap-4 mt-4 mb-8"
  >
    <div>
      <div class="image">
        <img
          loading="lazy"
          src="https://i.imgur.com/g3QjVEM.jpeg"
          alt="profile_picture"
        />
      </div>
      <div class="flex justify-center mt-4 gap-4">
        {#each socials as social (social.icon)}
          <a href={social.link} target="_blank" rel="noopener noreferrer">
            <AppSvg
              name={social.icon}
              alt={`${social.icon} icon`}
              fill='var(--app-color-text)'
              height="23"
              width="23"
            />
          </a>
        {/each}
      </div>
    </div>
    <div class="info text-base">
      <p>
        {m.home_bio1()}
        <Link to="https://www.senaimg.com.br/">SENAI.</Link>
        {m.home_bio1_after()}
      </p>
      <p>
        {m.home_bio2()}
        <Link to="https://www.criticaltechworks.com/">Critical Techworks</Link>.
      </p>
      <p>
        {m.home_bio3()}
        <a href="mailto: me@passoca.dev">me@passoca.dev</a>
      </p>
      {#if music}
        <SpotifyMusic {music} />
      {/if}
    </div>
  </div>
  <h2 class="font-boston mb-2">{m.home_besides()}</h2>
  <p class="text-base">
    {m.home_books()}
    <Link to="https://www.goodreads.com/user/show/139184791-passoca-freitas">goodreads</Link>.
  </p>
  <div class="flex flex-wrap gap-3 my-2 md:justify-between">
    {#each books as book (book.link)}
      <a href={book.link} class="w-auto" target="_blank">
        <img
          loading="lazy"
          src={`imgs/books/${book.img}`}
          alt={`${book.title}-book_cover`}
          class="h-32"
        />
      </a>
    {/each}
  </div>
  <p class="text-base">
    {m.home_bike()}
  </p>
  <div class="flex flex-col items-center md:flex-row md:justify-between">
    {#each trips as trip (trip.link)}
      <div
        class="video-card"
        style={`background-image: url('../../imgs/${trip.image}');`}
      >
        <a href={trip.link} class="video-content">{trip.title} </a>
      </div>
    {/each}
  </div>
  <p class="text-base mt-4">
    {m.home_games()}
  </p>
  <div class="flex flex-col items-center md:flex-row md:justify-between">
    {#each games as game (game.link)}
      <div
        class="video-card"
        style={`background-image: url('../../imgs/${game.image}');`}
      >
        <a href={game.link} class="video-content">{game.title} </a>
      </div>
    {/each}
  </div>
</Content>

<style lang="sass">
  h1
    font-size: clamp(36px, 8vw, 54px)
.info
  a
    border-bottom: 1px solid var(--app-color-primary)
.video-card
  width: 416px
  height: 234px
  margin-top: 16px
  background-size: cover
  color: var(--app-color-gray-text)
  transition: transform .35s cubic-bezier(0.215,0.61,0.355,1)
  a.video-content
    display: flex
    justify-content: center
    align-items: center
    height: 100%
    width: 100%
    opacity: 0
    text-align: center
    transition: backdrop-filter .35s cubic-bezier(0.215,0.61,0.355,1) ,opacity .35s cubic-bezier(0.215,0.61,0.355,1)
  &:hover
    transform: translateY(-8px)
    .video-content
      opacity: 1
      backdrop-filter: blur(2px) brightness(.45)
.image
  position: relative
  width: 200px
  height: 200px
  border-radius: 50%
  overflow: hidden
  img
    position: absolute
    top: 0
    left: 0
    height: 100%
    width: 100%
    transition: all .65s cubic-bezier(0.215,0.61,0.355,1)

</style>
