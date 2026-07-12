// Project cards shown on /projects, also indexed by the search palette.
export type Project = {
  name: string;
  description: string;
  features: string[];
  imageSrc?: string;
  imageAlt?: string;
  githubUrl?: string;
  websiteUrl?: string;
};

export const projects: Project[] = [
  {
    name: "dssoca",
    description:
      "My own Svelte 5 design system — signal green on near-black, monospace-forward, zero border-radius. It powers this very website.",
    features: [
      "Two orthogonal axes: color (dark/light) and size (sm/md/lg)",
      "Token-driven CSS custom properties — flip an axis on any ancestor and everything rescales",
      "Tokens-only import for apps that own their global styles",
      "Published on npm with CI and full docs",
    ],
    githubUrl: "https://github.com/httpassoca/dssoca",
    websiteUrl: "https://dssoca.passoca.dev",
  },
  {
    name: "Bloodborne Sudoku",
    description:
      "A Bloodborne-themed Sudoku with a custom UI and game feel — built to be playable and polished on mobile. AI btw.",
    features: [
      "Multiple difficulties + new puzzle generation",
      "Notes/pencil marks + error highlighting",
      "Keyboard support (desktop) + touch-first controls (mobile)",
      "Bloodborne-inspired theme, typography and sound design",
      "Multiplayer coop and duel modes",
    ],
    imageSrc: "/imgs/projects/bloodborne-sudoku.gif",
    imageAlt: "Bloodborne Sudoku gameplay screenshot",
    githubUrl: "https://github.com/httpassoca/bloodborne-sudoku",
    websiteUrl: "https://sudoku.passoca.dev",
  },
];
