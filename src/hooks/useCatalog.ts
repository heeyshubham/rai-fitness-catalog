'use client';

import { useState, useEffect } from 'react';
import type { CatalogState } from '@/types';

function useLocalState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);

  return [v, setV];
}

export function useCatalog(): CatalogState {
  const [items, setItems] = useLocalState<Record<string, number>>('rai:catalog', {});

  const add = (id: string) => setItems(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const remove = (id: string) => setItems(p => { const n = { ...p }; delete n[id]; return n; });
  const setQty = (id: string, q: number) => setItems(p => {
    if (q <= 0) { const n = { ...p }; delete n[id]; return n; }
    return { ...p, [id]: q };
  });
  const has = (id: string) => !!items[id];
  const count = Object.values(items).reduce((a, b) => a + b, 0);
  const distinct = Object.keys(items).length;

  return { items, add, remove, setQty, has, count, distinct };
}
