<script lang="ts">
  import { dark } from "../../stores/theme.store.ts";
  import SVG from "svelte-inline-svg";
  import Content from "$lib/components/Base/AppContent.svelte";
  import Title from "$lib/components/Base/AppTitle.svelte";
  import Link from "$lib/components/Base/AppLink.svelte";

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
              fill={$dark ? "#EEE" : "#111"}
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
    </div>
  </div>
</Content>

<style lang="sass">
.info
  a
    border-bottom: 1px solid var(--color-accent)
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
