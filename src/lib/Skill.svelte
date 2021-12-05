<script lang="ts" context="module">
  export type skill = {
    name?: string;
    icon?: string;
    color?: string;
    link?: string;
    title?: boolean;
    skills?: skill[];
    whiteColor?: string;
  };
</script>

<script lang="ts">
  import { dark } from "../stores/store";
  import SVG from "svelte-inline-svg";

  export let skill: skill;
  let color = skill.color;

  $: if (skill.whiteColor) {
    color = $dark ? skill.color : skill.whiteColor;
  }
</script>

<div>
  <a href={skill.link || ""} target="blank" class:cursor-default={!skill.link}>
    <SVG
      src={skill.icon}
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
  @apply flex items-center gap-2 text-sm
  width: fit-content
</style>
