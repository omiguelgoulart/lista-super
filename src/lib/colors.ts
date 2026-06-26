export type ListColorKey = "green" | "blue" | "violet" | "orange" | "rose" | "teal";

export interface ListColorPalette {
  tint: string;
  fg: string;
  solid: string;
}

export const LIST_COLORS: Record<ListColorKey, ListColorPalette> = {
  green:  { tint: "#f0fdf4", fg: "#15803d", solid: "#16a34a" },
  blue:   { tint: "#eff6ff", fg: "#1d4ed8", solid: "#2563eb" },
  violet: { tint: "#f5f3ff", fg: "#6d28d9", solid: "#7c3aed" },
  orange: { tint: "#fff7ed", fg: "#c2410c", solid: "#ea580c" },
  rose:   { tint: "#fff1f2", fg: "#be123c", solid: "#e11d48" },
  teal:   { tint: "#f0fdfa", fg: "#0f766e", solid: "#0d9488" },
};

export function getListColor(color: ListColorKey): ListColorPalette {
  return LIST_COLORS[color];
}
