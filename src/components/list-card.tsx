import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ListIconBox } from "@/components/list-icon";
import { LIST_COLORS } from "@/lib/colors";
import { selectListStats } from "@/lib/utils";
import type { ShoppingList } from "@/lib/types";
import type { CSSProperties } from "react";

interface Props {
  list: ShoppingList;
}

export function ListCard({ list }: Props) {
  const palette = LIST_COLORS[list.color];
  const { total, checked, pct } = selectListStats(list);
  const visible = list.members.slice(0, 3);

  return (
    <Link
      href={`/list/${list.id}`}
      className="flex items-center gap-3 p-4 rounded-[16px] border border-[#e4e4e7] bg-white hover:bg-[#fcfcfc] hover:border-[#d4d4d8] transition-colors group"
    >
      <ListIconBox icon={list.icon} color={list.color} size={48} />

      <div className="flex-1 min-w-0">
        <p
          className="text-[#18181b] truncate"
          style={{ fontSize: 15, fontWeight: 550, lineHeight: 1.3 }}
        >
          {list.name}
        </p>

        {/* Progress track */}
        <div
          className="mt-2 mb-1.5 h-1.5 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: "#f4f4f5" }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{ width: `${pct}%`, backgroundColor: palette.solid }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tabular-nums text-[#71717a]">
            {checked}/{total}
          </span>

          {/* Avatar stack */}
          <div className="flex items-center">
            {visible.map((m, idx) => (
              <div
                key={m.id}
                style={
                  {
                    width: 23,
                    height: 23,
                    borderRadius: "50%",
                    backgroundColor:
                      m.role === "owner" ? palette.solid : "#d4d4d8",
                    border: "2px solid #fff",
                    marginLeft: idx > 0 ? -6 : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: visible.length - idx,
                    flexShrink: 0,
                  } as CSSProperties
                }
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 8,
                    fontWeight: 700,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {m.name[0].toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChevronRight
        size={16}
        className="flex-shrink-0 text-[#d4d4d8] group-hover:text-[#a1a1aa] transition-colors"
      />
    </Link>
  );
}
