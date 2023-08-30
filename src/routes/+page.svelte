<script lang="ts">
  import type { PageData } from "./$types";
  import { theme } from "$lib/stores/theme.store";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";
  import SpotifyMusic from "$lib/components/SpotifyMusic.svelte";
  import AppSvg from "$lib/components/Base/AppSVG.svelte";
  import type { SVGNames } from "$lib/data/svgs";

  export let data: PageData;
  export let { music } = data;

  type icon = {
    icon: SVGNames;
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
  <div class="info">
    <h1 class="font-boston mb-2">Hi, I'm Rafael Passoca.</h1>
    <p>
      As a Frontend Engineer, I believe that appearence and practicity are the
      best influences to the user. <b
        >This is what matters. And I love to make it happen.</b
      >
    </p>
    <p class="text-base">
      If you just want my resumé
      <a
        target="_blank"
        href="https://www.notion.so/passoca/Curriculum-Vitae-Rafael-Freitas-f4e9a131885846cabdd6c0ab658f476d?pvs=4"
        title="resume">click here</a
      >
    </p>
    <div class="flex mt-4 justify-center">
      <Link to="/about" button blank={false}>More about me</Link>
    </div>
  </div>
  <div class="flex flex-col items-center md:items-start md:flex-row gap-4">
    <div>
      <div class="image">
        <img
          loading="lazy"
          src="https://tbnaluslgxzikblascgb.supabase.co/storage/v1/object/sign/passoca/images/profile_pic.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwYXNzb2NhL2ltYWdlcy9wcm9maWxlX3BpYy5wbmciLCJpYXQiOjE2ODgwNjk1MjIsImV4cCI6MTcxOTYwNTUyMn0.-2wlKr-QjliMAfmi4YToEQ7DDhFYKwbn0xbQhhfbrQo&t=2023-06-29T20%3A12%3A02.581Z"
          alt="my profile"
        />
      </div>
      <div class="flex justify-center mt-4 gap-4">
        {#each socials as social (social.icon)}
          <a href={social.link} target="_blank" rel="noopener noreferrer">
            <AppSvg
              name={social.icon}
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
        I realized I love creating interfaces.
      </p>
      <p>
        I'm currently developing apps for myself and <Link
          to="https://www.criticaltechworks.com/">Critical Techworks</Link
        >.
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
  h1
    font-size: clamp(36px, 8vw, 54px)
  a
    border-bottom: 1px solid var(--app-color-primary)
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
