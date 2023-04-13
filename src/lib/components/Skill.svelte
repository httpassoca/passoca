<script lang="ts" context="module">
  export type TSkill = {
    name?: string;
    icon?: string;
    color?: string;
    link?: string;
    title?: boolean;
    skills?: TSkill[];
    whiteColor?: string;
  };
</script>

<script lang="ts">
  import { theme } from "$lib/stores/theme.store";
  import SVG from "svelte-inline-svg";

  export let skill: TSkill;
  let color = skill.color;

  $: if (skill.whiteColor) {
    color = $theme === "dark" ? skill.color : skill.whiteColor;
  }
</script>

<div>
  <a href={skill.link || ""} target="blank" class:cursor-default={!skill.link}>
    <SVG
      src={`/icons/${skill.icon}.svg`}
      alt={`${skill.name} icon`}
      fill={color}
      height="23"
      width="23"
    />
    <span>{skill.name}</span>
  </a>
</div>

<style lang="sass">
a
  @apply flex items-center gap-2 text-base
  width: fit-content
</style>
