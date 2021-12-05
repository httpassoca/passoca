<script lang="ts" context="module">
  export type skill = {
    name?: string;
    icon?: string;
    color?: string;
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

<div class="flex items-center gap-2 text-sm">
  <SVG
    src={skill.icon}
    alt={`${skill.name} icon`}
    fill={color}
    height="23"
    width="23"
  />
  <span>{skill.name}</span>
</div>
