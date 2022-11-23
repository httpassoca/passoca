<script context="module" lang="ts">
  export async function load() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/now-playing`).then(
      (res) => res.json()
    ).catch((err) => {
      console.log(err);
      return;
    });
    let music = null;
    if (res.isPlaying) music = res.music;
    return { props: { music } };
  }
</script>

<script lang="ts">
  import { theme } from "$lib/stores/theme.store";
  import SVG from "svelte-inline-svg";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  import SpotifyMusic from "$lib/components/SpotifyMusic.svelte";
  export let music = null;

  type icon = {
    icon: string;
    link: string;
  };

  const socials: icon[] = [
    {
      icon: "linkedin",
      link: "/linkedin",
    },
    {
      icon: "instagram",
      link: "https://instagram.com/rafael.passoca",
    },
    {
      icon: "twitter",
      link: "/twitter",
    },
  ];
</script>

<Content page>
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
        and <b>HTML / CSS / JS</b>. Just playing with CSS doing fantasy websites
        I realize I love create interfaces.
      </p>
      <p>
        I'm currently developing apps for myself, <Link
          to="https://www.criticaltechworks.com/">Critical Techworks</Link
        > and <Link to="http://leagueofdevs.com">League of Devs</Link>.
      </p>
      <p>
        You can contact me via <a href="mailto: me@passoca.dev"> email. </a>
      </p>
      {#if music}
        <SpotifyMusic {music} />
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
