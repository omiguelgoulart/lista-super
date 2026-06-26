"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  value: number;
  unit?: string;
  onChange: (qty: number) => void;
  variant?: "compact" | "sheet";
}

export function QtyStepper({ value, unit, onChange, variant = "compact" }: Props) {
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(value + 1);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={dec}
          disabled={value <= 1}
          aria-label="Diminuir quantidade"
          className="flex items-center justify-center border border-[#e4e4e7] text-[#71717a] hover:bg-[#f4f4f5] active:bg-[#e4e4e7] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
          style={{ width: 22, height: 22, borderRadius: 7 }}
        >
          <Minus size={10} strokeWidth={2.5} />
        </button>

        <span
          className="font-mono text-sm text-[#18181b] text-center tabular-nums"
          style={{ minWidth: "2.5rem" }}
        >
          {value}
          {unit ? <span className="text-[#a1a1aa] ml-0.5 text-xs">{unit}</span> : null}
        </span>

        <button
          onClick={inc}
          aria-label="Aumentar quantidade"
          className="flex items-center justify-center border border-[#e4e4e7] text-[#71717a] hover:bg-[#f4f4f5] active:bg-[#e4e4e7] transition-colors"
          style={{ width: 22, height: 22, borderRadius: 7 }}
        >
          <Plus size={10} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={dec}
        disabled={value <= 1}
        aria-label="Diminuir quantidade"
        style={{ borderRadius: 11 }}
        className="h-11 w-11 border-[#e4e4e7] text-[#71717a]"
      >
        <Minus size={18} strokeWidth={2} />
      </Button>

      <span className="font-mono text-2xl font-medium text-[#18181b] tabular-nums min-w-[5rem] text-center">
        {value}
        {unit ? (
          <span className="text-[#a1a1aa] text-base font-normal ml-1">{unit}</span>
        ) : null}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={inc}
        aria-label="Aumentar quantidade"
        style={{ borderRadius: 11 }}
        className="h-11 w-11 border-[#e4e4e7] text-[#71717a]"
      >
        <Plus size={18} strokeWidth={2} />
      </Button>
    </div>
  );
}
