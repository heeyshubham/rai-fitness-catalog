'use client';

import { useState, useEffect, useRef } from 'react';
import type { CatalogState } from '@/types';

function useLocalState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  // Always start with `initial` so server and client render identically,
  // avoiding the hydration mismatch when localStorage has saved data.
  const [v, setV] = useState<T>(initial);
  const loaded = useRef(false);

  // After mount, hydrate from localStorage (client only, never runs on server).
  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) setV(JSON.parse(s));
    } catch {}
  }, [key]);

  // Persist changes back to localStorage, but skip the very first run
  // (before we've had a chance to hydrate) so we don't overwrite saved data.
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
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
