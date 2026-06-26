import { ItemRow } from "@/components/item-row";
import type { Item } from "@/lib/types";

interface Props {
  category: string;
  items: Item[];
  solid: string;
  onToggleItem: (itemId: string) => void;
  onSetQty: (itemId: string, qty: number) => void;
}

export function CategoryGroup({ category, items, solid, onToggleItem, onSetQty }: Props) {
  return (
    <div>
      <p
        className="text-[#a1a1aa] mb-2 px-1"
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {category}
      </p>

      <div className="bg-white rounded-[16px] border border-[#e4e4e7] overflow-hidden">
        {items.map((item, idx) => (
          <div key={item.id}>
            {idx > 0 && <div className="h-px bg-[#f4f4f5] mx-4" />}
            <ItemRow
              item={item}
              solid={solid}
              onToggleItem={onToggleItem}
              onSetQty={onSetQty}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
