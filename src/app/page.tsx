'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PRODUCTS, CATEGORIES, MUSCLES } from '@/data';
import type { Route, Filters } from '@/types';
import { useCatalog } from '@/hooks/useCatalog';
import TopBar from '@/components/TopBar';
import FeedHero from '@/components/FeedHero';
import ChipRow from '@/components/ChipRow';
import ProductCard from '@/components/ProductCard';
import FilterSheet from '@/components/FilterSheet';
import ProductDetail from '@/components/ProductDetail';
import CatalogScreen from '@/components/CatalogScreen';
import EnquiryScreen from '@/components/EnquiryScreen';
import Icon from '@/components/Icon';
import Silhouette from '@/components/Silhouette';

function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

function DesktopCatalogPanel({
  catalog,
  onEnquire,
  onOpen,
}: {
  catalog: ReturnType<typeof useCatalog>;
  onEnquire: () => void;
  onOpen: (id: string) => void;
}) {
  const items = Object.entries(catalog.items)
    .map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id === id)!, qty }))
    .filter(x => x.p);

  if (items.length === 0) {
    return (
      <div className="text-center px-2 py-10 text-text-dim flex-1 flex flex-col justify-center">
        <div className="mx-auto mb-[14px] w-16 h-16 rounded-[20px] bg-surface border border-line grid place-items-center">
          <Icon name="folder" size={26} stroke="var(--text-dim)" />
        </div>
        <div className="font-display text-[16px] text-text font-semibold">Empty catalog</div>
        <div className="text-[13px] mt-1 text-text-dim">Tap + on any machine to start.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="overflow-y-auto flex-1 -mr-[10px] pr-[10px]">
        {items.map(({ p, qty }) => (
          <div
            key={p.id}
            className="flex items-center gap-[14px] p-[10px] bg-surface rounded-lg border border-line mb-2 cursor-pointer"
            onClick={() => onOpen(p.id)}
          >
            <div className="w-[52px] h-[52px] rounded-[12px] bg-surface-2 relative flex-shrink-0 overflow-hidden">
              {p.photo
                ? <Image src={p.photo} alt={p.name} fill style={{ objectFit: 'contain', padding: '3px' }} sizes="52px" />
                : <Silhouette kind={p.silhouette} hue={p.hue} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="m-0 font-display text-[14px] font-semibold tracking-[-0.015em] whitespace-nowrap overflow-hidden text-ellipsis">
                {p.name}
              </h4>
              <div className="font-mono text-[10px] text-text-mute tracking-[0.06em] uppercase mt-1">{p.code}</div>
            </div>
            <div
              className="flex items-center gap-1 bg-bg border border-line rounded-full p-1 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="w-[34px] h-[34px] rounded-full grid place-items-center text-text flex-shrink-0 hover:bg-surface-2"
                onClick={() => catalog.setQty(p.id, qty - 1)}
              >
                <Icon name="minus" size={12} />
              </button>
              <span className="font-mono text-[12px] min-w-[22px] text-center">{qty}</span>
              <button
                className="w-[34px] h-[34px] rounded-full grid place-items-center text-text flex-shrink-0 hover:bg-surface-2"
                onClick={() => catalog.setQty(p.id, qty + 1)}
              >
                <Icon name="plus" size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-line my-[18px]" />

      <div className="flex justify-between items-baseline mb-3">
        <div>
          <div className="font-display text-[32px] font-bold tracking-[-0.03em] leading-none">{catalog.count}</div>
          <div className="font-mono text-[10px] text-text-mute tracking-[0.1em] uppercase mt-1">Units · {items.length} models</div>
        </div>
        <Icon name="pdf" size={22} stroke="var(--text-dim)" />
      </div>
      <button
        className="flex items-center justify-center gap-[10px] px-[18px] py-[14px] rounded-md bg-surface border border-accent font-medium text-[14px] w-full transition-all duration-150 hover:bg-surface-2 text-accent mb-2"
        onClick={onEnquire}
        style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}
      >
        <Icon name="pdf" size={14} stroke="var(--accent)" /> Generate quote PDF
      </button>
      <button className="flex items-center justify-center gap-[10px] px-[18px] py-[14px] rounded-md bg-surface border border-line font-medium text-[14px] w-full transition-all duration-150 hover:bg-surface-2">
        <Icon name="share" size={14} /> Share catalog link
      </button>
    </div>
  );
}

export default function App() {
  const catalog = useCatalog();
  const [route, setRoute] = useState<Route>({ name: 'browse' });
  const [activeCat, setActiveCat] = useState('all');
  const [filters, setFilters] = useState<Filters>({ muscles: [], useCases: [], capacityMax: 500, sort: 'Featured' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<{ text: string; t: number } | null>(null);

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (activeCat !== 'all') list = list.filter(p => p.category === activeCat);
    if (filters.muscles?.length) list = list.filter(p => p.muscles.some(m => filters.muscles.includes(m)));
    if (filters.useCases?.length) list = list.filter(p => p.use.some(u => filters.useCases.includes(u)));
    if (filters.capacityMax) {
      list = list.filter(p => {
        const n = parseInt(p.capacity);
        return isNaN(n) || n <= filters.capacityMax;
      });
    }
    const sort = filters.sort || 'Featured';
    if (sort === 'A–Z') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'Capacity') list = [...list].sort((a, b) => parseInt(b.capacity) - parseInt(a.capacity));
    return list;
  }, [activeCat, filters]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: PRODUCTS.length };
    CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') c[cat.id] = PRODUCTS.filter(p => p.category === cat.id).length;
    });
    return c;
  }, []);

  const activeFilterCount = (filters.muscles?.length || 0) + (filters.useCases?.length || 0) + (filters.capacityMax && filters.capacityMax < 500 ? 1 : 0);

  const prevCount = useRef(catalog.distinct);
  useEffect(() => {
    if (catalog.distinct > prevCount.current && route.name === 'browse') {
      setToast({ text: 'Added to catalog', t: Date.now() });
      const id = setTimeout(() => setToast(null), 1800);
      prevCount.current = catalog.distinct;
      return () => clearTimeout(id);
    }
    prevCount.current = catalog.distinct;
  }, [catalog.distinct, route.name]);

  const openProduct = (id: string) => setRoute({ name: 'detail', id });
  const goBrowse = () => setRoute({ name: 'browse' });
  const openCatalog = () => setRoute({ name: 'catalog' });
  const openEnquiry = (productId?: string) => setRoute({ name: 'enquiry', id: productId });

  return (
    <div className={cls('min-h-screen relative bg-bg app-grid')}>
      {/* DESKTOP: left sidebar */}
      <aside className="hidden desk:flex border-r border-line px-[22px] py-7 sticky top-0 h-screen overflow-y-auto flex-col">
        {/* brand */}
        <div className="flex items-center gap-[10px] font-display font-bold tracking-[-0.02em] text-[19px] mb-[26px]">
          <div className="w-[30px] h-[30px] rounded-[9px] bg-accent grid place-items-center text-white font-display font-extrabold text-[16px]">R</div>
          <div>
            <div className="leading-none">Rai Fitness</div>
            <small className="font-mono text-[9px] tracking-[0.18em] text-text-dim uppercase block leading-none mt-[2px]">EST · 1986 · INDIA</small>
          </div>
        </div>

        <h5 className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-mute mt-[22px] mb-2 font-medium">Browse</h5>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={cls(
              'flex items-center gap-3 px-[14px] py-[11px] rounded-[14px] mb-[2px] cursor-pointer text-[14px] font-medium transition-all duration-150',
              activeCat === c.id
                ? 'bg-surface text-text'
                : 'text-text-dim hover:bg-surface hover:text-text'
            )}
            onClick={() => { setActiveCat(c.id); goBrowse(); }}
          >
            <Icon name={c.id === 'cardio' ? 'heart' : 'grid'} size={16} />
            {c.label}
            <span className={cls(
              'ml-auto font-mono text-[11px] px-[7px] py-[2px] rounded-full',
              activeCat === c.id ? 'bg-accent text-white' : 'bg-bg text-text-mute'
            )}>
              {counts[c.id] || 0}
            </span>
          </button>
        ))}

        <h5 className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-mute mt-[22px] mb-2 font-medium">Muscle group</h5>
        {MUSCLES.slice(0, 6).map(m => (
          <button
            key={m.id}
            className={cls(
              'flex items-center gap-3 px-[14px] py-[11px] rounded-[14px] mb-[2px] cursor-pointer text-[14px] font-medium transition-all duration-150',
              filters.muscles?.includes(m.id)
                ? 'bg-surface text-text'
                : 'text-text-dim hover:bg-surface hover:text-text'
            )}
            onClick={() => setFilters(p => {
              const cur = p.muscles || [];
              const next = cur.includes(m.id) ? cur.filter(x => x !== m.id) : [...cur, m.id];
              return { ...p, muscles: next };
            })}
          >
            <span className="w-4 inline-flex">
              <span className="w-[6px] h-[6px] rounded-full bg-current opacity-50" />
            </span>
            {m.label}
          </button>
        ))}

        <div className="flex-1" />
        <div className="h-px bg-line my-[18px]" />
        <button
          className="flex items-center justify-center gap-[10px] px-[18px] py-[14px] rounded-md bg-surface border border-line font-medium text-[14px] w-full transition-all duration-150 hover:bg-surface-2"
          onClick={() => openEnquiry()}
        >
          <Icon name="message" size={16} /> Talk to a specialist
        </button>
      </aside>

      {/* MAIN COLUMN */}
      <main className="overflow-hidden">
        {/* MOBILE only top bar */}
        <TopBar
          onCatalog={openCatalog}
          catalogCount={catalog.count}
          onSearch={() => setFilterOpen(true)}
        />

        {/* DESKTOP: feed grid */}
        <div className="hidden desk:block px-8 py-7 pb-[60px] overflow-y-auto max-h-screen">
          <div className="flex items-start justify-between">
            <FeedHero count={PRODUCTS.length} />
            <div className="flex gap-[10px] mt-2">
              <button
                className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95"
                onClick={() => setFilterOpen(true)}
              >
                <Icon name="sliders" size={18} />
              </button>
              <button className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95">
                <Icon name="sort" size={18} />
              </button>
            </div>
          </div>
          <ChipRow
            active={activeCat}
            setActive={setActiveCat}
            onFilter={() => setFilterOpen(true)}
            counts={counts}
            activeFilters={activeFilterCount}
          />
          <div className="flex justify-between items-baseline mb-[14px]">
            <div className="font-mono text-[11px] text-text-mute tracking-[0.1em] uppercase">
              Showing {filtered.length} of {PRODUCTS.length} machines
            </div>
            <div className="font-mono text-[11px] text-text-mute tracking-[0.1em] uppercase">
              Sort · {filters.sort || 'Featured'}
            </div>
          </div>
          <div className="grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} onOpen={() => openProduct(p.id)} catalog={catalog} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="py-[60px] px-5 text-center text-text-dim">
              <div className="font-display text-[24px] text-text mb-[6px]">No matches.</div>
              Try widening your filters.
            </div>
          )}
        </div>

        {/* MOBILE feed */}
        <div className="desk:hidden">
          <FeedHero count={PRODUCTS.length} />
          <ChipRow
            active={activeCat}
            setActive={setActiveCat}
            onFilter={() => setFilterOpen(true)}
            counts={counts}
            activeFilters={activeFilterCount}
          />
          <div className="px-5 flex flex-col gap-[14px] feed-bottom-pad">
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} onOpen={() => openProduct(p.id)} catalog={catalog} />
            ))}
            {filtered.length === 0 && (
              <div className="py-[60px] text-center text-text-dim">
                <div className="font-display text-[22px] text-text mb-[6px]">No matches.</div>
                Try widening your filters.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* DESKTOP: right sidebar (catalog panel) */}
      <aside className="hidden desk:flex border-l border-line px-[22px] py-7 sticky top-0 h-screen overflow-y-auto flex-col">
        <div className="flex items-center justify-between mb-[18px]">
          <h4 className="font-display text-[20px] font-semibold tracking-[-0.02em] m-0">Your Catalog</h4>
          <button className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95 relative">
            <Icon name="folder" size={16} />
            {catalog.count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[5px] rounded-[9px] bg-accent text-white font-mono text-[10px] font-semibold grid place-items-center border-2 border-bg">
                {catalog.count}
              </span>
            )}
          </button>
        </div>
        <DesktopCatalogPanel catalog={catalog} onEnquire={() => openEnquiry()} onOpen={openProduct} />
      </aside>

      {/* Floating CTA (mobile only) */}
      {route.name === 'browse' && (
        <div className="desk:hidden fixed left-1/2 -translate-x-1/2 z-40 flex flex-row gap-2 items-center justify-center max-w-[min(420px,calc(100vw-32px))] fab-bottom">
          {catalog.distinct > 0 && (
            <button
              className="inline-flex items-center gap-2 px-4 py-[13px] rounded-full bg-text text-bg font-semibold text-[14px] whitespace-nowrap [box-shadow:0_20px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] transition-[transform] duration-150 hover:-translate-y-px"
              onClick={openCatalog}
            >
              <span className="w-[22px] h-[22px] rounded-full grid place-items-center bg-black/[0.12]">
                <Icon name="folder" size={14} />
              </span>
              View · {catalog.count} {catalog.count === 1 ? 'item' : 'items'}
            </button>
          )}
          <button
            className="inline-flex items-center gap-2 px-4 py-[13px] rounded-full bg-accent text-white font-semibold text-[14px] whitespace-nowrap [box-shadow:0_20px_40px_rgba(230,57,70,0.35),0_0_0_1px_rgba(255,255,255,0.08)] transition-[transform] duration-150 hover:-translate-y-px"
            onClick={() => openEnquiry()}
          >
            <span className="w-[22px] h-[22px] rounded-full grid place-items-center bg-white/[0.16]">
              <Icon name="message" size={14} />
            </span>
            Talk to expert
          </button>
        </div>
      )}

      {/* Routes (overlay screens) */}
      {route.name === 'detail' && route.id && (
        <ProductDetail
          p={PRODUCTS.find(p => p.id === route.id)!}
          onClose={goBrowse}
          catalog={catalog}
          onOpen={(id) => setRoute({ name: 'detail', id })}
          onTalk={() => openEnquiry(route.id)}
          onCatalog={openCatalog}
        />
      )}
      {route.name === 'catalog' && (
        <CatalogScreen
          catalog={catalog}
          onBack={goBrowse}
          onOpen={openProduct}
          onEnquire={() => openEnquiry()}
        />
      )}
      {route.name === 'enquiry' && (
        <EnquiryScreen
          onBack={() => route.id ? setRoute({ name: 'detail', id: route.id }) : openCatalog()}
          catalog={catalog}
          fromProduct={route.id}
        />
      )}

      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        productCount={filtered.length}
      />

      {toast && (
        <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[100] px-4 py-[10px] rounded-full bg-text text-bg text-[13px] font-medium [box-shadow:0_12px_30px_rgba(0,0,0,0.5)] animate-toast-in flex items-center gap-2">
          <Icon name="check" size={14} /> {toast.text}
        </div>
      )}
    </div>
  );
}
