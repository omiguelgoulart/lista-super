import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ShoppingList } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function selectListStats(list: ShoppingList) {
  const total = list.items.length > 0 ? list.items.length : (list.itemCount ?? 0);
  const checked = list.items.filter((i) => i.checked).length;
  const pct = total === 0 ? 0 : Math.round((checked / total) * 100);
  return { total, checked, pct };
}
