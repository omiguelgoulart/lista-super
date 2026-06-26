"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { QtyStepper } from "@/components/qty-stepper";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";

const UNITS = ["un", "kg", "g", "L", "ml", "dúzia"];
const CATS = [
  "Frutas e Verduras",
  "Laticínios",
  "Limpeza",
  "Padaria",
  "Bebidas",
  "Outros",
];

interface Props {
  listId: string;
  open: boolean;
  onClose: () => void;
  onAddItem: (listId: string, item: Omit<Item, "id">) => void;
}

export function AddItemSheet({ listId, open, onClose, onAddItem }: Props) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("un");
  const [cat, setCat] = useState("Outros");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddItem(listId, { cat, name: trimmed, qty, unit, checked: false });
    setName("");
    setQty(1);
    setUnit("un");
    setCat("Outros");
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="rounded-t-[26px] border-0 p-0 max-h-[92dvh] flex flex-col"
      >
        {/* Grabber */}
        <div
          className="mx-auto mt-3 shrink-0"
          style={{
            width: 38,
            height: 5,
            borderRadius: 9999,
            backgroundColor: "#e4e4e7",
          }}
        />

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2">
          <SheetTitle
            className="text-[#18181b] mb-5"
            style={{ fontSize: 18, fontWeight: 600 }}
          >
            Novo item
          </SheetTitle>

          {/* Nome */}
          <Input
            autoFocus
            placeholder="Ex: Banana prata"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="border-[#e4e4e7] bg-white text-[#18181b] placeholder:text-[#a1a1aa] focus-visible:ring-0 focus-visible:border-[#d4d4d8] mb-5"
            style={{ height: 46, borderRadius: 11 }}
          />

          {/* Stepper */}
          <div className="flex justify-center mb-5">
            <QtyStepper
              value={qty}
              unit={unit}
              onChange={setQty}
              variant="sheet"
            />
          </div>

          {/* Chips — Unidade */}
          <Overline>Unidade</Overline>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
            {UNITS.map((u) => (
              <Chip
                key={u}
                label={u}
                active={unit === u}
                onClick={() => setUnit(u)}
              />
            ))}
          </div>

          {/* Chips — Categoria */}
          <Overline>Categoria</Overline>
          <div className="flex flex-wrap gap-2 mb-2">
            {CATS.map((c) => (
              <Chip
                key={c}
                label={c}
                active={cat === c}
                onClick={() => setCat(c)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 shrink-0">
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="w-full text-white font-medium flex items-center justify-center transition-colors"
            style={{
              height: 48,
              borderRadius: 11,
              fontSize: 15,
              backgroundColor: name.trim() ? "#18181b" : "#d4d4d8",
              cursor: name.trim() ? "pointer" : "not-allowed",
            }}
          >
            Adicionar item
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[#a1a1aa] mb-2"
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 text-sm font-medium transition-colors",
        active
          ? "bg-[#18181b] text-white"
          : "bg-white border border-[#e4e4e7] text-[#71717a] hover:bg-[#f4f4f5]",
      )}
      style={{ height: 34, borderRadius: 9, paddingLeft: 14, paddingRight: 14 }}
    >
      {label}
    </button>
  );
}
