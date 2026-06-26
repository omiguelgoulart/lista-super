import {
  Apple,
  Leaf,
  Milk,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { LIST_COLORS } from "@/lib/colors";
import type { ListColor, ListIcon } from "@/lib/types";

const ICON_MAP: Record<ListIcon, LucideIcon> = {
  basket:   ShoppingBasket,
  cart:     ShoppingCart,
  apple:    Apple,
  milk:     Milk,
  leaf:     Leaf,
  sparkles: Sparkles,
};

interface Props {
  icon: ListIcon;
  color: ListColor;
  size?: number;
}

export function ListIconBox({ icon, color, size = 40 }: Props) {
  const palette = LIST_COLORS[color];
  const Icon = ICON_MAP[icon];
  const radius = Math.round(size * 0.3);
  const iconSize = Math.round(size * 0.48);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: palette.tint,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={iconSize} strokeWidth={1.8} style={{ color: palette.fg }} />
    </div>
  );
}
