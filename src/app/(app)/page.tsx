"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListCard } from "@/components/list-card";
import { useShoppingLists } from "@/hooks/useLists";

export default function HomePage() {
  const { lists, loading, createList } = useShoppingLists();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = lists.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase()),
  );

  async function handleCreate() {
    const id = await createList({
      name: "Nova lista",
      icon: "basket",
      color: "green",
      members: [
        {
          id: crypto.randomUUID(),
          name: "Você",
          email: "voce@email.com",
          role: "owner",
        },
      ],
      items: [],
    });

    if (id) {
      router.push(`/list/${id}`);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 pt-14 pb-3">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1
              className="text-[#18181b]"
              style={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              Minhas listas
            </h1>
            <p className="text-[#71717a] text-sm mt-0.5">
              {lists.length} {lists.length === 1 ? "lista" : "listas"}
            </p>
          </div>

          {/* User avatar */}
          <button
            aria-label="Sair"
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 40, height: 40, backgroundColor: "#18181b" }}
          >
            <span
              className="text-white font-semibold select-none"
              style={{ fontSize: 15 }}
            >
              V
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#a1a1aa]"
          />
          <Input
            placeholder="Buscar lista…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-[#fafafa] border-[#e4e4e7] text-[#18181b] placeholder:text-[#a1a1aa] focus-visible:ring-0 focus-visible:border-[#d4d4d8]"
            style={{ height: 42, borderRadius: 11 }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-4 pb-32 space-y-3 overflow-y-auto">
        {loading && lists.length === 0 ? (
          <p className="text-center text-[#a1a1aa] text-sm pt-10">
            Carregando listas…
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#a1a1aa] text-sm pt-10">
            Nenhuma lista encontrada
          </p>
        ) : (
          filtered.map((list) => <ListCard key={list.id} list={list} />)
        )}
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-105 px-4 py-4 bg-white/90 backdrop-blur-sm border-t border-[#f4f4f5]">
        <Button
          onClick={handleCreate}
          className="w-full gap-2"
          style={{ height: 48, borderRadius: 11 }}
        >
          <Plus size={18} />
          Nova lista
        </Button>
      </div>
    </main>
  );
}
