export type ColorKey = "purple" | "pink" | "yellow" | "blue";

export const COLOR_OPTIONS: {
  key: ColorKey;
  label: string;
  fill: string;
  accent: string;
  light: string;
}[] = [
  {
    key: "purple",
    label: "Morado",
    fill: "#E3E0F8",
    accent: "#6D28D9",
    light: "#EDE9FE",
  },
  {
    key: "pink",
    label: "Rosa",
    fill: "#FDE2DC",
    accent: "#EC4899",
    light: "#FDE8EE",
  },
  {
    key: "yellow",
    label: "Amarillo",
    fill: "#FFF6C8",
    accent: "#D97706",
    light: "#FFFBEB",
  },
  {
    key: "blue",
    label: "Azul",
    fill: "#DDF2FF",
    accent: "#0EA5E9",
    light: "#E6F9FF",
  },
];

export const COLOR_MAP = COLOR_OPTIONS.reduce(
  (acc, cur) => {
    acc[cur.key] = cur;
    return acc;
  },
  {} as Record<ColorKey, (typeof COLOR_OPTIONS)[number]>,
);

export const DEFAULT_COLOR: ColorKey = "blue";
