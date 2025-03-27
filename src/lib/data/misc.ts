import type { SVGNames } from "./svgs";

type icon = {
  icon: SVGNames;
  link: string;
};

export const socials: icon[] = [
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

export const books = [
  {
    title: "The Death of Ivan Ilych",
    img: "ivan.jpg",
    link: "https://www.goodreads.com/book/show/6876642-a-morte-de-ivan-ilitch",
  },
  {
    title: "The House of Hades",
    img: "hades.jpg",
    link: "https://www.goodreads.com/book/show/12127810-the-house-of-hades",
  },
  {
    title: "Prayer",
    img: "oracao.jpeg",
    link: "https://www.goodreads.com/book/show/18468099-a-ora-o",
  },
  {
    title: "Frakenstein",
    img: "frankenstein.jpg",
    link: "https://www.goodreads.com/book/show/35031085-frankenstein",
  },
  {
    title: "Dune",
    img: "dune.jpeg",
    link: "https://www.goodreads.com/book/show/44767458-dune",
  },
  {
    title: "The Man Who Was Thursday",
    img: "man-who-was-thursday.webp",
    link: "https://www.goodreads.com/book/show/184419.The_Man_Who_Was_Thursday",
  },
  {
    title: "On the Shortness of Life",
    img: "seneca.jpg",
    link: "https://www.goodreads.com/book/show/97412.On_the_Shortness_of_Life",
  },
];

export const trips = [
  {
    title: "Pedal Póvoa do Varzim (Portugal) - Vigo (Espanha) 135km",
    image: "passadicos.jpg",
    link: "https://youtu.be/HuPzFTAqW1g?si=mleAIJyL2yw_uLGA",
  },
  {
    title: "Porto night ride just hanging around",
    image: "porto_night.jpg",
    link: "https://youtu.be/Yds5ZDy_B8c?si=UuqtJwmocdlMV8fH",
  },
];

export const games = [
  {
    title: "Sekiro #30 - ISSHIN ASHINA HESITOU ⚔️☠️",
    image: "isshin.webp",
    link: "https://youtu.be/ijNTyKrjmuI?si=afKTZ93yawCfHyd0",
  },
  {
    title: "Elden Ring - Some final bosses in NG+1",
    image: "eldenring.jpg",
    link: "https://youtu.be/mkS8XoV36Aw?si=ecXTWJO7GfD-2O6-",
  },
];
