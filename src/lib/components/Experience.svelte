<script lang="ts" context="module">
  export type TExperience = {
    name: string;
    site?: string;
    icon?: string;
    image?: string;
    link?: string;
    color?: string;
    time: string;
    whiteColor?: string;
  };
</script>

<script lang="ts">
  import { theme } from "$lib/stores/theme.store";
  import SVG from "svelte-inline-svg";

  export let experience: TExperience;
  let color = experience.color || "";

  $: if (experience.whiteColor) {
    color = $theme === "dark" ? experience.color : experience.whiteColor;
  }
</script>

<div class="experience mt-8">
  <div class="w-12 h-12">
    {#if experience.icon}
      <SVG
        src={`/icons/${experience.icon}.svg`}
        width="50"
        height="50"
        fill={color}
      />
    {:else}
      <img
        src={`/imgs/${experience.image}.webp`}
        alt={`${experience.name} image`}
      />
    {/if}
  </div>
  <div class="w-full">
    <div class="flex justify-between">
      <div>
        <h3>{experience.name}</h3>
        <a href={experience.link} target="_blank" title="website">
          {experience.site}
        </a>
      </div>
      <span class="text-base">
        {experience.time}
      </span>
    </div>
    <ul>
      <slot />
    </ul>
  </div>
</div>

<style lang="sass">
.experience
  display: flex
  gap: 20px
  span
    color: var(--app-color-gray-text)
  a
    color: var(--app-color-gray-text)
    display: flex
    align-items: center
    gap: 6px
    font-size: .875rem
    margin-bottom: 8px
  :global(li)
    position: relative
    margin-left: 15px
    @apply text-base
    &::before
      content: ''
      height: 4px
      width: 4px
      display: block
      position: absolute
      left: -14px
      border-left: 3px solid transparent
      border-right: 3px solid transparent
      border-bottom: 5px solid var(--app-color-primary)
      top: 11px
      transform: rotate(90deg)

</style>
