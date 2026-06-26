"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Item, ShoppingList } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const DEFAULT_ICON = "cart" as const;
const DEFAULT_COLOR = "green" as const;

type RemoteCategory = {
  id: string;
  listId: string;
  name: string;
  color: string | null;
  order: number;
};

type RemoteList = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  categories: RemoteCategory[];
  _count: { items: number };
};

type RemoteItem = {
  id: string;
  listId: string;
  categoryId: string | null;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  notes: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type RemoteListDetail = RemoteList & {
  items: RemoteItem[];
};

function getUrl(path: string) {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL não está definida");
  return `${BASE_URL}${path}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(getUrl(path));
  if (!res.ok) throw new Error(`GET ${path}: ${res.status}`);
  return res.json();
}

async function mutateJson<T = void>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(getUrl(path), {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : {},
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

function mapItem(item: RemoteItem, categories: RemoteCategory[]): Item {
  const cat = categories.find((c) => c.id === item.categoryId)?.name ?? "Outros";
  return {
    id: item.id,
    cat,
    name: item.name,
    qty: item.quantity,
    unit: item.unit || "un",
    checked: item.checked,
    note: item.notes ?? undefined,
  };
}

function mapList(remote: RemoteList | RemoteListDetail): ShoppingList {
  const categories = "items" in remote ? remote.categories : [];
  return {
    id: remote.id,
    name: remote.name,
    icon: (remote.icon ?? DEFAULT_ICON) as ShoppingList["icon"],
    color: (remote.color ?? DEFAULT_COLOR) as ShoppingList["color"],
    members: [
      { id: "owner", name: "Você", email: "voce@email.com", role: "owner" },
    ],
    items: "items" in remote
      ? remote.items.map((item) => mapItem(item, categories))
      : [],
    itemCount: remote._count?.items,
  };
}

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!BASE_URL) {
      console.error("NEXT_PUBLIC_API_URL não está definida");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchJson<RemoteList[]>("/lists")
      .then((remote) => setLists(remote.map(mapList)))
      .catch((err) => console.error("Erro ao carregar listas:", err))
      .finally(() => setLoading(false));
  }, []);

  const createList = async (
    list: Omit<ShoppingList, "id">,
  ): Promise<string | undefined> => {
    try {
      const created = await mutateJson<RemoteList>("POST", "/lists", {
        name: list.name,
        icon: list.icon,
        color: list.color,
      });
      setLists((prev) => [mapList(created), ...prev]);
      return created.id;
    } catch (err) {
      console.error("Erro ao criar lista:", err);
    }
  };

  return { lists, loading, createList };
}

export function useShoppingList(listId: string | null) {
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(false);
  const catsRef = useRef<RemoteCategory[]>([]);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const remote = await fetchJson<RemoteListDetail>(`/lists/${id}`);
      catsRef.current = remote.categories;
      setList(mapList(remote));
    } catch (err) {
      console.error("Erro ao carregar lista:", err);
      setList(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!listId) {
      setList(null);
      return;
    }
    if (!BASE_URL) {
      console.error("NEXT_PUBLIC_API_URL não está definida");
      return;
    }
    load(listId);
  }, [listId, load]);

  const updateList = (updater: (list: ShoppingList) => ShoppingList) => {
    setList((cur) => (cur ? updater(cur) : cur));
  };

  const toggleItem = async (itemId: string) => {
    const item = list?.items.find((i) => i.id === itemId);
    if (!item) return;
    const newChecked = !item.checked;
    updateList((cur) => ({
      ...cur,
      items: cur.items.map((i) =>
        i.id === itemId ? { ...i, checked: newChecked } : i,
      ),
    }));
    try {
      await mutateJson("PUT", `/items/${itemId}`, { checked: newChecked });
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      if (listId) load(listId);
    }
  };

  const setQty = async (itemId: string, qty: number) => {
    const safeQty = Math.max(1, qty);
    updateList((cur) => ({
      ...cur,
      items: cur.items.map((i) => (i.id === itemId ? { ...i, qty: safeQty } : i)),
    }));
    try {
      await mutateJson("PUT", `/items/${itemId}`, { quantity: safeQty });
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
      if (listId) load(listId);
    }
  };

  const addItem = async (item: Omit<Item, "id">) => {
    if (!listId) return;
    try {
      let categoryId: string | undefined;
      if (item.cat && item.cat !== "Outros") {
        const existing = catsRef.current.find((c) => c.name === item.cat);
        if (existing) {
          categoryId = existing.id;
        } else {
          const newCat = await mutateJson<RemoteCategory>(
            "POST",
            `/lists/${listId}/categories`,
            { name: item.cat, order: catsRef.current.length },
          );
          catsRef.current = [...catsRef.current, newCat];
          categoryId = newCat.id;
        }
      }
      const created = await mutateJson<RemoteItem>("POST", "/items", {
        listId,
        name: item.name,
        quantity: item.qty,
        unit: item.unit,
        notes: item.note,
        categoryId,
      });
      updateList((cur) => ({
        ...cur,
        items: [...cur.items, mapItem(created, catsRef.current)],
      }));
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
    }
  };

  const markAll = async (checked: boolean) => {
    if (!listId) return;
    updateList((cur) => ({
      ...cur,
      items: cur.items.map((i) => ({ ...i, checked })),
    }));
    try {
      await mutateJson("PATCH", "/items/check-all", { listId, checked });
    } catch (err) {
      console.error("Erro ao marcar todos:", err);
      load(listId);
    }
  };

  const clearChecked = async () => {
    if (!listId) return;
    updateList((cur) => ({
      ...cur,
      items: cur.items.filter((i) => !i.checked),
    }));
    try {
      await mutateJson("DELETE", `/lists/${listId}/checked`);
    } catch (err) {
      console.error("Erro ao limpar itens:", err);
      load(listId);
    }
  };

  const duplicateList = async (): Promise<string | undefined> => {
    if (!listId) return;
    try {
      const newList = await mutateJson<RemoteList>(
        "POST",
        `/lists/${listId}/duplicate`,
        {},
      );
      return newList.id;
    } catch (err) {
      console.error("Erro ao duplicar lista:", err);
    }
  };

  const removeList = async () => {
    if (!listId) return;
    try {
      await mutateJson("DELETE", `/lists/${listId}`);
      setList(null);
    } catch (err) {
      console.error("Erro ao remover lista:", err);
    }
  };

  return {
    list,
    loading,
    toggleItem,
    setQty,
    addItem,
    markAll,
    clearChecked,
    duplicateList,
    removeList,
  };
}
