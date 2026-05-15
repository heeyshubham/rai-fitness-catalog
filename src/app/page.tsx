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
      <div style={{ textAlign: 'center', padding: '40px 8px', color: 'var(--text-dim)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ margin: '0 auto 14px', width: 64, height: 64, borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}>
          <Icon name="folder" size={26} stroke="var(--text-dim)" />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text)', fontWeight: 600 }}>Empty catalog</div>
        <div style={{ fontSize: 13, marginTop: 4, color: 'var(--text-dim)' }}>Tap + on any machine to start.</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ overflowY: 'auto', flex: 1, marginRight: -10, paddingRight: 10 }}>
        {items.map(({ p, qty }) => (
          <div key={p.id} className="cat-row" style={{ padding: 10, marginBottom: 8, cursor: 'pointer' }} onClick={() => onOpen(p.id)}>
            <div className="thumb" style={{ width: 52, height: 52, borderRadius: 12, position: 'relative' }}>
              {p.photo
                ? <Image src={p.photo} alt={p.name} fill style={{ objectFit: 'contain', padding: '3px' }} sizes="52px" />
                : <Silhouette kind={p.silhouette} hue={p.hue} />
              }
            </div>
            <div className="info">
              <h4 style={{ fontSize: 14 }}>{p.name}</h4>
              <div className="meta" style={{ fontSize: 10 }}>{p.code}</div>
            </div>
            <div className="qty" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => catalog.setQty(p.id, qty - 1)}><Icon name="minus" size={12} /></button>
              <span className="num" style={{ fontSize: 12 }}>{qty}</span>
              <button onClick={() => catalog.setQty(p.id, qty + 1)}><Icon name="plus" size={12} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{catalog.count}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mute)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>Units · {items.length} models</div>
        </div>
        <Icon name="pdf" size={22} stroke="var(--text-dim)" />
      </div>
      <button className="btn-block" onClick={onEnquire} style={{ color: 'var(--accent)', borderColor: 'var(--accent)', marginBottom: 8 }}>
        <Icon name="pdf" size={14} stroke="var(--accent)" /> Generate quote PDF
      </button>
      <button className="btn-block">
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
    <div className="app">
      {/* DESKTOP: left sidebar */}
      <aside className="sidebar-left desktop-only">
        <div className="brand">
          <div className="brand-mark">R</div>
          <div>
            <div style={{ lineHeight: 1 }}>Rai Fitness</div>
            <small>EST · 1986 · INDIA</small>
          </div>
        </div>

        <h5>Browse</h5>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={cls('nav-item', activeCat === c.id && 'active')}
            onClick={() => { setActiveCat(c.id); goBrowse(); }}
          >
            <Icon name={c.id === 'cardio' ? 'heart' : 'grid'} size={16} />
            {c.label}
            <span className="count">{counts[c.id] || 0}</span>
          </button>
        ))}

        <h5>Muscle group</h5>
        {MUSCLES.slice(0, 6).map(m => (
          <button
            key={m.id}
            className={cls('nav-item', filters.muscles?.includes(m.id) && 'active')}
            onClick={() => setFilters(p => {
              const cur = p.muscles || [];
              const next = cur.includes(m.id) ? cur.filter(x => x !== m.id) : [...cur, m.id];
              return { ...p, muscles: next };
            })}
          >
            <span style={{ width: 16, display: 'inline-flex' }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: 'currentColor', opacity: 0.5 }} />
            </span>
            {m.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <div className="divider" />
        <button className="btn-block" onClick={() => openEnquiry()}>
          <Icon name="message" size={16} /> Talk to a specialist
        </button>
      </aside>

      {/* MAIN COLUMN */}
      <main className="main-col-wrap">
        {/* MOBILE only top bar */}
        <TopBar
          onCatalog={openCatalog}
          catalogCount={catalog.count}
          onSearch={() => setFilterOpen(true)}
        />

        {/* DESKTOP: feed grid */}
        <div className="main-col desktop-only">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <FeedHero count={PRODUCTS.length} />
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="icon-btn" onClick={() => setFilterOpen(true)}><Icon name="sliders" size={18} /></button>
              <button className="icon-btn"><Icon name="sort" size={18} /></button>
            </div>
          </div>
          <ChipRow
            active={activeCat}
            setActive={setActiveCat}
            onFilter={() => setFilterOpen(true)}
            counts={counts}
            activeFilters={activeFilterCount}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Showing {filtered.length} of {PRODUCTS.length} machines
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Sort · {filters.sort || 'Featured'}
            </div>
          </div>
          <div className="feed-grid">
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} onOpen={() => openProduct(p.id)} catalog={catalog} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text)', marginBottom: 6 }}>No matches.</div>
              Try widening your filters.
            </div>
          )}
        </div>

        {/* MOBILE feed */}
        <div className="mobile-only">
          <FeedHero count={PRODUCTS.length} />
          <ChipRow
            active={activeCat}
            setActive={setActiveCat}
            onFilter={() => setFilterOpen(true)}
            counts={counts}
            activeFilters={activeFilterCount}
          />
          <div className="feed">
            {filtered.map(p => (
              <ProductCard key={p.id} p={p} onOpen={() => openProduct(p.id)} catalog={catalog} />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-dim)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', marginBottom: 6 }}>No matches.</div>
                Try widening your filters.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* DESKTOP: right sidebar (catalog panel) */}
      <aside className="sidebar-right desktop-only">
        <div className="head">
          <h4>Your Catalog</h4>
          <button className="icon-btn">
            <Icon name="folder" size={16} />
            {catalog.count > 0 && <span className="count-badge">{catalog.count}</span>}
          </button>
        </div>
        <DesktopCatalogPanel catalog={catalog} onEnquire={() => openEnquiry()} onOpen={openProduct} />
      </aside>

      {/* Floating CTA (mobile only) */}
      {route.name === 'browse' && (
        <div className="fab-stack mobile-only">
          {catalog.distinct > 0 && (
            <button className="fab" onClick={openCatalog}>
              <span className="icon-circle"><Icon name="folder" size={14} /></span>
              View · {catalog.count} {catalog.count === 1 ? 'item' : 'items'}
            </button>
          )}
          <button className="fab accent" onClick={() => openEnquiry()}>
            <span className="icon-circle"><Icon name="message" size={14} /></span>
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
        <div className="toast">
          <Icon name="check" size={14} /> {toast.text}
        </div>
      )}
    </div>
  );
}
