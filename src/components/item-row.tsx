"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { QtyStepper } from "@/components/qty-stepper";
import type { Item } from "@/lib/types";

interface Props {
  item: Item;
  solid: string;
  onToggleItem: (itemId: string) => void;
  onSetQty: (itemId: string, qty: number) => void;
}

export function ItemRow({ item, solid, onToggleItem, onSetQty }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 min-h-13">
      {/* Left: toque alterna o checked */}
      <button
        onClick={() => onToggleItem(item.id)}
        className="flex items-center gap-3 flex-1 text-left min-w-0"
      >
        {/* Checkbox */}
        <div
          className="shrink-0 flex items-center justify-center transition-colors duration-150"
          style={{
            width: 22,
            height: 22,
            borderRadius: 7,
            border: item.checked ? "none" : "2px solid #d4d4d8",
            backgroundColor: item.checked ? solid : "transparent",
          }}
        >
          {item.checked && (
            <Check size={13} strokeWidth={2.5} style={{ color: "#fff" }} />
          )}
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "truncate",
              item.checked ? "line-through text-[#a1a1aa]" : "text-[#18181b]",
            )}
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            {item.name}
          </p>
          {item.note && (
            <p className="text-xs text-[#a1a1aa] mt-0.5 truncate">
              {item.note}
            </p>
          )}
        </div>
      </button>

      {/* Direita: stepper — não altera o checked */}
      <div className={cn("transition-opacity", item.checked && "opacity-35")}>
        <QtyStepper
          value={item.qty}
          unit={item.unit}
          onChange={(qty) => onSetQty(item.id, qty)}
          variant="compact"
        />
      </div>
    </div>
  );
}
