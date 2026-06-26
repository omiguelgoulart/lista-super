"use client";

import { useRouter } from "next/navigation";
import {
  CheckCheck,
  Copy,
  Eraser,
  Share2,
  Square,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ListIconBox } from "@/components/list-icon";
import { selectListStats } from "@/lib/utils";
import type { ShoppingList } from "@/lib/types";

interface Props {
  list: ShoppingList;
  open: boolean;
  onClose: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onMarkAll: (checked: boolean) => void;
  onClearChecked: () => void;
}

export function ListActionsSheet({
  list,
  open,
  onClose,
  onDuplicate,
  onRemove,
  onMarkAll,
  onClearChecked,
}: Props) {
  const router = useRouter();
  const { total, checked } = selectListStats(list);

  function run(fn: () => void) {
    fn();
    onClose();
  }

  const actions: { icon: LucideIcon; label: string; fn: () => void }[] = [
    {
      icon: Share2,
      label: "Compartilhar",
      fn: () => {
        onClose();
        router.push(`/list/${list.id}/share`);
      },
    },
    {
      icon: Copy,
      label: "Duplicar",
      fn: () => run(onDuplicate),
    },
    {
      icon: CheckCheck,
      label: "Marcar todos comprados",
      fn: () => run(() => onMarkAll(true)),
    },
    {
      icon: Square,
      label: "Desmarcar todos",
      fn: () => run(() => onMarkAll(false)),
    },
    {
      icon: Eraser,
      label: "Limpar comprados",
      fn: () => run(onClearChecked),
    },
  ];

  function handleDelete() {
    onRemove();
    onClose();
    router.replace("/");
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="rounded-t-[26px] border-0 p-0"
      >
        {/* Grabber */}
        <div
          className="mx-auto mt-3"
          style={{
            width: 38,
            height: 5,
            borderRadius: 9999,
            backgroundColor: "#e4e4e7",
          }}
        />

        {/* Identidade da lista */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-4">
          <ListIconBox icon={list.icon} color={list.color} size={44} />
          <div className="min-w-0">
            <p
              className="text-[#18181b] truncate"
              style={{ fontSize: 16, fontWeight: 600 }}
            >
              {list.name}
            </p>
            <p className="text-[#71717a] text-sm mt-0.5">
              {total} {total === 1 ? "item" : "itens"} · {checked} comprado
              {checked !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="h-px bg-[#f4f4f5]" />

        {/* Ações */}
        <div>
          {actions.map(({ icon: Icon, label, fn }) => (
            <button
              key={label}
              onClick={fn}
              className="flex items-center gap-3 w-full px-5 py-3.5 text-left hover:bg-[#f4f4f5] active:bg-[#f4f4f5] transition-colors"
            >
              <Icon size={18} className="text-[#71717a] shrink-0" />
              <span className="text-[#18181b]" style={{ fontSize: 15 }}>
                {label}
              </span>
            </button>
          ))}

          {/* Excluir */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-3 w-full px-5 py-3.5 text-left hover:bg-[#fef2f2] active:bg-[#fef2f2] transition-colors"
          >
            <Trash2
              size={18}
              className="shrink-0"
              style={{ color: "#dc2626" }}
            />
            <span style={{ fontSize: 15, color: "#dc2626" }}>
              Excluir lista
            </span>
          </button>
        </div>

        <div className="h-px bg-[#f4f4f5]" />

        {/* Cancelar */}
        <div className="px-5 py-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-[#e4e4e7] text-[#18181b] hover:bg-[#f4f4f5]"
            style={{ height: 46, borderRadius: 11 }}
          >
            Cancelar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
