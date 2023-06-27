<script lang="ts">
  import type { SVGNames } from "$lib/data/svgs";

  import { theme } from "$lib/stores/theme.store";
  import SVG from "./Base/AppSVG.svelte";

  type TSkill = {
    name?: string;
    icon?: SVGNames;
    color?: string;
    link?: string;
    title?: boolean;
    skills?: TSkill[];
    whiteColor?: string;
  };

  export let skill: TSkill;
  let color = skill.color;

  $: if (skill.whiteColor) {
    color = $theme === "dark" ? skill.color : skill.whiteColor;
  }
</script>

<div>
  <a href={skill.link || ""} target="blank" class:cursor-default={!skill.link}>
    <SVG
      name={skill.icon}
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
