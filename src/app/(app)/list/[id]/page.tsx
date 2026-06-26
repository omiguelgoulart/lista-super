"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  MoreHorizontal,
  Plus,
  ShoppingBasket,
} from "lucide-react";
import { selectListStats } from "@/lib/utils";
import { LIST_COLORS } from "@/lib/colors";
import { ListIconBox } from "@/components/list-icon";
import { CategoryGroup } from "@/components/category-group";
import { AddItemSheet } from "@/components/add-item-sheet";
import { ListActionsSheet } from "@/components/list-actions-sheet";
import { useShoppingList } from "@/hooks/useLists";
import type { Item } from "@/lib/types";

export default function ListPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);

  const {
    list,
    loading,
    toggleItem,
    setQty,
    addItem,
    markAll,
    clearChecked,
    duplicateList,
    removeList,
  } = useShoppingList(id ?? null);

  async function handleDuplicate() {
    const newId = await duplicateList();
    if (newId) router.replace(`/list/${newId}`);
  }

  function handleRemove() {
    removeList();
    router.replace("/");
  }

  const grouped = useMemo<[string, Item[]][]>(() => {
    if (!list) return [];
    const map = new Map<string, Item[]>();
    for (const item of list.items) {
      map.set(item.cat, [...(map.get(item.cat) ?? []), item]);
    }
    return Array.from(map.entries());
  }, [list]);

  if (!list) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4 text-center text-[#71717a]">
        {loading ? "Carregando lista…" : "Lista não encontrada."}
      </div>
    );
  }

  const palette = LIST_COLORS[list.color];
  const { total, checked, pct } = selectListStats(list);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-14 pb-5">
        {/* Nav */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => router.back()}
            aria-label="Voltar"
            className="flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              backgroundColor: "#f4f4f5",
            }}
          >
            <ChevronLeft size={20} className="text-[#18181b]" />
          </button>

          <button
            onClick={() => setActionsOpen(true)}
            aria-label="Ações da lista"
            className="flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              backgroundColor: "#f4f4f5",
            }}
          >
            <MoreHorizontal size={20} className="text-[#18181b]" />
          </button>
        </div>

        {/* Identidade */}
        <div className="flex items-center gap-3 mb-5">
          <ListIconBox icon={list.icon} color={list.color} size={48} />
          <div className="min-w-0">
            <h1
              className="text-[#18181b] truncate"
              style={{ fontSize: 20, fontWeight: 600 }}
            >
              {list.name}
            </h1>
            <p className="text-[#71717a] text-sm mt-0.5">
              {total} {total === 1 ? "item" : "itens"} · {checked} comprado
              {checked !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div
            className="flex-1 h-6 rounded-full overflow-hidden"
            style={{ backgroundColor: palette.tint }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                backgroundColor: palette.solid,
                transition: "width 0.25s ease",
              }}
            />
          </div>
          <span
            className="font-mono text-sm tabular-nums text-[#18181b] text-right"
            style={{ minWidth: "3rem" }}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 bg-[#fafafa] px-4 py-5 pb-32 space-y-5 overflow-y-auto">
        {list.items.length === 0 ? (
          <EmptyState />
        ) : (
          grouped.map(([cat, items]) => (
            <CategoryGroup
              key={cat}
              category={cat}
              items={items}
              solid={palette.solid}
              onToggleItem={toggleItem}
              onSetQty={setQty}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-105 px-4 py-4 bg-[#fafafa] border-t border-[#f4f4f5]">
        <button
          onClick={() => setAddItemOpen(true)}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-[#d4d4d8] bg-[#fafafa] text-[#71717a] transition-colors hover:bg-[#f4f4f5]"
          style={{ height: 46, borderRadius: 11 }}
        >
          <Plus size={16} />
          <span style={{ fontSize: 14 }}>Adicionar item</span>
        </button>
      </div>

      <AddItemSheet
        listId={list.id}
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onAddItem={(_, item) => addItem(item)}
      />
      <ListActionsSheet
        list={list}
        open={actionsOpen}
        onClose={() => setActionsOpen(false)}
        onDuplicate={handleDuplicate}
        onRemove={handleRemove}
        onMarkAll={markAll}
        onClearChecked={clearChecked}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="flex items-center justify-center"
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: "#f4f4f5",
        }}
      >
        <ShoppingBasket size={28} className="text-[#a1a1aa]" />
      </div>
      <div className="text-center">
        <p className="text-[#18181b] font-medium">Lista vazia</p>
        <p className="text-sm text-[#a1a1aa] mt-1">
          Adicione itens tocando no botão abaixo
        </p>
      </div>
    </div>
  );
}
