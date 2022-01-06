<script context="module" lang="ts">
  export async function load() {
    const url =
      "https://api.spotify.com/v1/me/player/currently-playing?market=ES";
    const headers = new Headers();
    headers.set(
      "Authorization",
      `Bearer ${import.meta.env.VITE_SPOTIFY_TOKEN}`
    );
    const res = await fetch(url, {
      headers,
    });
    const actualMusic = await res.json();
    return { props: { actualMusic } };
  }
</script>

<script lang="ts">
  import { theme } from "$lib/stores/theme.store";
  import SVG from "svelte-inline-svg";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  export let actualMusic;

  type icon = {
    icon: string;
    link: string;
  };

  const socials: icon[] = [
    {
      icon: "linkedin",
      link: "https://linkedin.com/in/passoca",
    },
    {
      icon: "github",
      link: "https://github.com/httpassoca",
    },
    {
      icon: "instagram",
      link: "https://instagram.com/rafael.passoca",
    },
  ];
</script>

<Content page>
  <Title>About me</Title>
  <div class="flex flex-col items-center md:items-start md:flex-row gap-4">
    <div>
      <div class="image">
        <img
          loading="lazy"
          src="https://avatars.githubusercontent.com/u/49541181?v=4"
          alt="my pic"
        />
      </div>
      <div class="flex justify-center mt-4 gap-4">
        {#each socials as social (social.icon)}
          <a href={social.link} target="_blank" rel="noopener noreferrer">
            <SVG
              src={`/icons/${social.icon}.svg`}
              alt={`${social.icon} icon`}
              fill={$theme === "dark" ? "#EEE" : "#111"}
              height="23"
              width="23"
            />
          </a>
        {/each}
      </div>
    </div>
    <div class="info text-base">
      <p>
        I learned programming at
        <Link to="https://www.senaimg.com.br/">SENAI.</Link>
        I started with <b>C++</b>, then <b>MySQL</b>, then <b>C#</b>, <b>PHP</b>
        and <b>HTML / CSS / JS</b>.
      </p>
      <p>
        Just playing with CSS doing fantasy websites I realize that I love
        create interfaces. And today I live by that.
      </p>
      <p>
        You can contact me via <a href="mailto: trabsom.rafael@gmail.com">
          email
        </a>
      </p>
      {#if actualMusic.is_playing}
        <div>
          Right now I am listening to:
          <b>
            {actualMusic.item.name}
          </b>
          from
          <b>
            {actualMusic.item.artists[0].name}
          </b>
          <img src={actualMusic.item.album.images[1].url} alt="actual_album" />
        </div>
      {/if}
    </div>
  </div>
</Content>

<style lang="sass">
.info
  a
    border-bottom: 1px solid var(--app-color-primary)
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
    &:hover
      transform: scale(2)
      top: 38%
      left: 10%

</style>
