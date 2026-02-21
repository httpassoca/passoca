import type { SVGNames } from "$lib/data/svgs";

export type TExperience = {
  name: string;
  site?: string;
  icon?: SVGNames;
  image?: string;
  link?: string;
  color?: string;
  time: string;
  whiteColor?: string;
};

export type TSkill = {
  name?: string;
  icon?: SVGNames;
  color?: string;
  link?: string;
  title?: boolean;
  skills?: TSkill[];
  whiteColor?: string;
};
