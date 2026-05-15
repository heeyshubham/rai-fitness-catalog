/* global React, ReactDOM, Silhouette, Icon, PRODUCTS, CATEGORIES, MUSCLES, USE_CASES */
/* global TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakColor */

const { useState, useEffect, useMemo, useRef } = React;

// =====================================================================
// Helpers
// =====================================================================

function useLocalState(key, initial) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

function cls(...args) { return args.filter(Boolean).join(' '); }

// =====================================================================
// Catalog context (via prop drilling — simple)
// =====================================================================
function useCatalog() {
  const [items, setItems] = useLocalState('rai:catalog', {}); // {id: qty}
  const add = (id) => setItems(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const remove = (id) => setItems(p => { const n = { ...p }; delete n[id]; return n; });
  const setQty = (id, q) => setItems(p => {
    if (q <= 0) { const n = { ...p }; delete n[id]; return n; }
    return { ...p, [id]: q };
  });
  const has = (id) => !!items[id];
  const count = Object.values(items).reduce((a, b) => a + b, 0);
  const distinct = Object.keys(items).length;
  return { items, add, remove, setQty, has, count, distinct };
}

// =====================================================================
// Top bar
// =====================================================================
function TopBar({ onCatalog, catalogCount, onSearch, onMenu }) {
  return (
    <header className="topbar mobile-only">
      <div className="brand">
        <div className="brand-mark">R</div>
        <div>
          <div style={{ lineHeight: 1 }}>Rai Fitness</div>
          <small>EST · 1986 · INDIA</small>
        </div>
      </div>
      <div className="row">
        <button className="icon-btn" onClick={onSearch} aria-label="Search">
          <Icon name="search" size={18} />
        </button>
        <button className="icon-btn" onClick={onCatalog} aria-label="Catalog">
          <Icon name="folder" size={18} />
          {catalogCount > 0 && <span className="count-badge">{catalogCount}</span>}
        </button>
      </div>
    </header>
  );
}

// =====================================================================
// Hero (feed header)
// =====================================================================
function FeedHero({ count }) {
  return (
    <div className="feed-hero">
      <h1>Build your <em>floor.</em><br />Machine by machine.</h1>
      <p>Browse {count} commercial-grade pieces. Tap to inspect, save the ones that fit, and we'll prepare a tailored quote.</p>
    </div>
  );
}

// =====================================================================
// Chip row (categories)
// =====================================================================
function ChipRow({ active, setActive, onFilter, counts, activeFilters }) {
  const totalFilters = activeFilters;
  return (
    <div className="chip-row">
      <button className={cls('chip', 'filter-chip')} onClick={onFilter}>
        <Icon name="sliders" size={14} />
        Filters
        {totalFilters > 0 && <span className="chip-count">·{totalFilters}</span>}
      </button>
      {CATEGORIES.map(c => (
        <button
          key={c.id}
          className={cls('chip', active === c.id && 'active')}
          onClick={() => setActive(c.id)}
        >
          {c.label}
          <span className="chip-count">{counts[c.id] || 0}</span>
        </button>
      ))}
    </div>
  );
}

// =====================================================================
// Product card (mobile feed)
// =====================================================================
function ProductCard({ p, onOpen, catalog, accent }) {
  const inCat = catalog.has(p.id);
  const cat = CATEGORIES.find(c => c.id === p.category);
  return (
    <article className="card" onClick={onOpen} data-screen-label={`Card ${p.name}`}>
      <div className="card-media">
        <Silhouette kind={p.silhouette} hue={p.hue} label={p.code} />
        <div className="badge-row">
          <span className="cat-tag"><span className="dot" />{cat?.label || p.category}</span>
        </div>
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <div className="sub">
          <span className="muscle">{p.muscles.slice(0, 2).map(m => MUSCLES.find(x => x.id === m)?.label).join(' · ')}</span>
          <span className="price">{p.code}</span>
        </div>
        <div className="card-meta">
          <div className="meta">CAPACITY <strong>{p.capacity}</strong></div>
          <div className="meta">FOOTPRINT <strong>{p.footprint}</strong></div>
          <div className="meta">SERIES <strong>{p.series.replace(' Series', '')}</strong></div>
        </div>
        <button
          className={cls('card-add-btn', inCat && 'added')}
          onClick={(e) => { e.stopPropagation(); inCat ? catalog.remove(p.id) : catalog.add(p.id); }}
          aria-label={inCat ? 'Remove from catalog' : 'Add to catalog'}
        >
          <span className="card-add-ico">
            <Icon name={inCat ? 'check' : 'plus'} size={18} sw={2} />
          </span>
          <span className="card-add-lbl">{inCat ? 'Added to Catalog' : 'Add to Catalog'}</span>
          <span className="card-add-arrow">
            <Icon name="arrow-right" size={16} sw={2} />
          </span>
        </button>
      </div>
    </article>
  );
}

// Desktop variant — same as ProductCard but slightly denser
function ProductCardDesktop(props) {
  // Reuse the same card; CSS handles density.
  return <ProductCard {...props} />;
}

// =====================================================================
// Filter sheet
// =====================================================================
function FilterSheet({ open, onClose, filters, setFilters, productCount }) {
  if (!open) return null;
  const toggle = (key, val) => {
    setFilters(p => {
      const cur = p[key] || [];
      const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
      return { ...p, [key]: next };
    });
  };
  const reset = () => setFilters({ muscles: [], useCases: [], capacityMax: 500 });

  return (
    <React.Fragment>
      <div className="sheet-overlay" onClick={onClose} />
      <div className="sheet" role="dialog">
        <div className="sheet-handle" />
        <div className="sheet-h">
          <div>
            <h3>Refine</h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.06em', marginTop: 4 }}>
              {productCount} MACHINES MATCH
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>
        <div className="sheet-body">
          <div className="filter-group">
            <div className="filter-group-h">
              <div className="label">Muscle Group</div>
              <div className="meta">{filters.muscles?.length || 0} SELECTED</div>
            </div>
            <div className="opt-grid">
              {MUSCLES.map(m => (
                <button
                  key={m.id}
                  className={cls('opt', filters.muscles?.includes(m.id) && 'selected')}
                  onClick={() => toggle('muscles', m.id)}
                >
                  <span className="check" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-h">
              <div className="label">Use Case</div>
              <div className="meta">{filters.useCases?.length || 0} SELECTED</div>
            </div>
            <div className="opt-grid">
              {USE_CASES.map(u => (
                <button
                  key={u.id}
                  className={cls('opt', filters.useCases?.includes(u.id) && 'selected')}
                  onClick={() => toggle('useCases', u.id)}
                >
                  <span className="check" />
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-h">
              <div className="label">Max Capacity</div>
              <div className="meta">{filters.capacityMax || 500} KG</div>
            </div>
            <div className="range-row">
              <input
                type="range" min="100" max="500" step="10"
                value={filters.capacityMax || 500}
                onChange={(e) => setFilters(p => ({ ...p, capacityMax: +e.target.value }))}
                className="slider"
              />
              <span className="range-readout">{filters.capacityMax || 500} kg</span>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-group-h">
              <div className="label">Sort by</div>
            </div>
            <div className="opt-grid">
              {['Featured', 'Newest', 'A–Z', 'Capacity'].map(s => (
                <button
                  key={s}
                  className={cls('opt', (filters.sort || 'Featured') === s && 'selected')}
                  onClick={() => setFilters(p => ({ ...p, sort: s }))}
                >
                  <span className="check" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="sheet-actions">
          <button className="btn-block" onClick={reset}>Reset</button>
          <button className="btn-primary" onClick={onClose} style={{ flex: 1 }}>
            Show {productCount} results
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

// =====================================================================
// Product detail (immersive)
// =====================================================================
function ProductHero({ p }) {
  const images = (p.images && p.images.length) ? p.images : [{ silhouette: p.silhouette, hue: p.hue, label: p.code }];
  const railRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (!w) return;
      const idx = Math.round(el.scrollLeft / w);
      setActive(Math.max(0, Math.min(images.length - 1, idx)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [images.length]);

  const goTo = (i) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  if (images.length === 1) {
    return (
      <div className="detail-hero">
        <Silhouette kind={images[0].silhouette} hue={images[0].hue} label={images[0].label || p.code} />
      </div>
    );
  }

  return (
    <div className="detail-hero">
      <div className="hero-rail" ref={railRef}>
        {images.map((im, i) => (
          <div key={i} className="hero-slide">
            <Silhouette kind={im.silhouette} hue={im.hue} label={im.label} />
          </div>
        ))}
      </div>
      <div className="hero-counter">
        <span className="num">{String(active + 1).padStart(2, '0')}</span>
        <span className="sep">/</span>
        <span className="tot">{String(images.length).padStart(2, '0')}</span>
        {images[active]?.label && <span className="lbl">{images[active].label}</span>}
      </div>
      <div className="hero-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={cls('hero-dot', active === i && 'active')}
            onClick={() => goTo(i)}
            aria-label={`View ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ProductDetail({ p, onClose, catalog, onOpen, onTalk }) {
  const inCat = catalog.has(p.id);
  const cat = CATEGORIES.find(c => c.id === p.category);
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 40);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [p.id]);
  // related: same category, exclude self, top 4
  const related = PRODUCTS.filter(x => x.id !== p.id && (x.category === p.category || x.muscles.some(m => p.muscles.includes(m)))).slice(0, 4);
  return (
    <div className={cls('detail', scrolled && 'is-scrolled')} ref={scrollRef} role="dialog" data-screen-label={`Detail ${p.name}`}>
      <div className="detail-topbar detail-topbar--sticky">
        <button className="icon-btn" onClick={onClose}><Icon name="arrow-left" size={18} /></button>
        <div className="row">
          <button className="icon-btn"><Icon name="share" size={18} /></button>
          <button className="icon-btn"><Icon name="heart" size={18} /></button>
        </div>
      </div>
      <ProductHero p={p} />
      <div className="detail-body">
        <h1 className="detail-title">{p.name}</h1>
        <div className="detail-sub">
          <span className="pill">{cat?.label}</span>
          <span>· {p.series}</span>
          <span>· {p.code}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          {p.muscles.map(m => (
            <span key={m} className="opt selected" style={{ pointerEvents: 'none', padding: '8px 12px', fontSize: 12 }}>
              <span className="check" /> {MUSCLES.find(x => x.id === m)?.label}
            </span>
          ))}
        </div>

        <div className="section-h">Overview</div>
        <p className="desc">{p.description}</p>

        <div className="section-h">Specifications</div>
        <div className="spec-grid">
          <div className="spec-cell">
            <div className="k">Resistance</div>
            <div className="v">{p.weightStack}</div>
          </div>
          <div className="spec-cell">
            <div className="k">Max Capacity</div>
            <div className="v">{p.capacity.split(' ')[0]}<small>{p.capacity.split(' ').slice(1).join(' ') || 'kg'}</small></div>
          </div>
          <div className="spec-cell">
            <div className="k">Footprint</div>
            <div className="v">{p.footprint.split(' ')[0]}<small>{p.footprint.split(' ').slice(1).join(' ')}</small></div>
          </div>
          <div className="spec-cell">
            <div className="k">Unit Weight</div>
            <div className="v">{p.weight.split(' ')[0]}<small>{p.weight.split(' ').slice(1).join(' ')}</small></div>
          </div>
          <div className="spec-cell">
            <div className="k">Finish</div>
            <div className="v" style={{ fontSize: 15, fontFamily: 'var(--font-body)', fontWeight: 500 }}>{p.color}</div>
          </div>
          <div className="spec-cell">
            <div className="k">Warranty</div>
            <div className="v">10<small>YEAR FRAME</small></div>
          </div>
        </div>

        <div className="section-h">Build & Features</div>
        <ul className="feature-list">
          {p.features.map((f, i) => (
            <li key={i}>
              <div className="num">0{i + 1}</div>
              <div className="text"><strong>{f.t}</strong><span>{f.d}</span></div>
            </li>
          ))}
        </ul>

        <div className="section-h">Best for</div>
        <div className="opt-grid">
          {p.use.map(u => (
            <span key={u} className="opt" style={{ pointerEvents: 'none' }}>{USE_CASES.find(x => x.id === u)?.label}</span>
          ))}
        </div>

        <div className="expert-cta" onClick={onTalk}>
          <div className="av">A</div>
          <div>
            <div className="t1">Talk to a specialist</div>
            <div className="t2">Get a tailored quote for {p.name} →</div>
          </div>
          <div className="arrow"><Icon name="arrow-up-right" size={18} /></div>
        </div>

        <div className="section-h">You may also like</div>
        <div className="related-row">
          {related.map(r => (
            <div key={r.id} className="related-card" onClick={() => onOpen(r.id)}>
              <div className="related-media">
                <Silhouette kind={r.silhouette} hue={r.hue} />
              </div>
              <div className="related-body">
                <h4>{r.name}</h4>
                <div className="tag">{CATEGORIES.find(c => c.id === r.category)?.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-actionbar">
        <button className="btn-ghost" onClick={onTalk} aria-label="Talk to expert"><Icon name="message" size={20} /></button>
        <button
          className={cls('btn-primary', inCat && 'added')}
          onClick={() => inCat ? catalog.remove(p.id) : catalog.add(p.id)}
        >
          <Icon name={inCat ? 'check' : 'plus'} size={18} />
          {inCat ? 'Added to Catalog' : 'Add to Catalog'}
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// Catalog (wishlist) screen
// =====================================================================
function CatalogScreen({ catalog, onBack, onOpen, onEnquire }) {
  const items = Object.entries(catalog.items).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id === id), qty: q })).filter(x => x.p);
  return (
    <div className="detail" data-screen-label="Catalog">
      <div className="detail-topbar" style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 6 }}>
        <button className="icon-btn" onClick={onBack}><Icon name="arrow-left" size={18} /></button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>Your Catalog</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase' }}>
            {items.length} machines · {catalog.count} units
          </div>
        </div>
        <button className="icon-btn"><Icon name="share" size={18} /></button>
      </div>

      <div className="cat-page">
        {items.length === 0 ? (
          <div className="cat-empty">
            <div className="ico"><Icon name="folder" size={32} stroke="var(--text-dim)" /></div>
            <h2>Your catalog is empty</h2>
            <p>Tap the + on any machine to start building your floor plan. We'll turn it into a tailored PDF quote.</p>
            <button className="btn-primary" onClick={onBack}>Browse machines</button>
          </div>
        ) : (
          <React.Fragment>
            {items.map(({ p, qty }) => (
              <div key={p.id} className="cat-row">
                <div className="thumb" onClick={() => onOpen(p.id)}>
                  <Silhouette kind={p.silhouette} hue={p.hue} />
                </div>
                <div className="info" onClick={() => onOpen(p.id)}>
                  <h4>{p.name}</h4>
                  <div className="meta">{p.code} · {CATEGORIES.find(c => c.id === p.category)?.label}</div>
                </div>
                <div className="qty">
                  <button onClick={() => catalog.setQty(p.id, qty - 1)}><Icon name="minus" size={14} /></button>
                  <span className="num">{qty}</span>
                  <button onClick={() => catalog.setQty(p.id, qty + 1)}><Icon name="plus" size={14} /></button>
                </div>
              </div>
            ))}

            <div className="cat-summary">
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div className="num-big">{catalog.count}</div>
                  <div className="lab">Units in catalog</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="num-big" style={{ fontSize: 32, color: 'var(--text-dim)' }}>{items.length}</div>
                  <div className="lab">Distinct models</div>
                </div>
              </div>

              <div className="divider" />

              <PdfPreview items={items} />

              <div style={{ marginTop: 18, display: 'flex', gap: 10, flexDirection: 'column' }}>
                <button className="btn-primary" onClick={onEnquire}>
                  <Icon name="pdf" size={18} />
                  Generate PDF & Request Quote
                </button>
                <button className="btn-block"><Icon name="share" size={16} /> Share catalog link</button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

function PdfPreview({ items }) {
  return (
    <div className="pdf-preview">
      <div className="pdf-h">
        <div>
          <div className="ti">Quotation Request</div>
          <div className="sub">RAI FITNESS · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
        </div>
        <div className="pdf-mark">R</div>
      </div>
      {items.slice(0, 4).map((it, i) => (
        <div key={it.p.id} className="pdf-row">
          <span className="n">{String(i + 1).padStart(2, '0')}</span>
          <div className="nm">
            <strong>{it.p.name}</strong>
            <small>{it.p.code}</small>
          </div>
          <span className="q">× {it.qty}</span>
        </div>
      ))}
      {items.length > 4 && (
        <div style={{ paddingTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7a7065', textAlign: 'center' }}>
          + {items.length - 4} more items
        </div>
      )}
    </div>
  );
}

// =====================================================================
// Enquiry / Expert screen
// =====================================================================
function EnquiryScreen({ onBack, catalog, fromProduct }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', org: '',
    useCase: 'commercial', timeline: '1-3 mo', city: '',
    message: '',
  });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const items = Object.entries(catalog.items).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id === id), qty: q })).filter(x => x.p);
  const submitted = step === 3;

  return (
    <div className="detail" data-screen-label="Enquiry">
      <div className="detail-topbar" style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 6 }}>
        <button className="icon-btn" onClick={onBack}><Icon name="arrow-left" size={18} /></button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>Talk to a Specialist</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase' }}>
            {submitted ? 'Request sent' : `Step ${step + 1} of 3`}
          </div>
        </div>
        <button className="icon-btn" onClick={onBack}><Icon name="x" size={18} /></button>
      </div>

      <div className="cat-page" style={{ paddingTop: 20 }}>
        {!submitted && (
          <div className="steps">
            <div className={cls('step', step >= 0 && (step > 0 ? 'done' : 'active'))} />
            <div className={cls('step', step >= 1 && (step > 1 ? 'done' : 'active'))} />
            <div className={cls('step', step >= 2 && 'active')} />
          </div>
        )}

        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600, margin: '0 0 8px' }}>
              Who should we call?
            </h2>
            <p style={{ color: 'var(--text-dim)', margin: '0 0 22px' }}>One of our floor specialists will reach out within 24 hours.</p>

            <div className="form-field">
              <label>Full name</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@gym.com" />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 …" />
              </div>
            </div>
            <div className="form-field">
              <label>Gym / Organization</label>
              <input value={form.org} onChange={e => update('org', e.target.value)} placeholder="e.g. Pulse Gym, Bengaluru" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600, margin: '0 0 8px' }}>
              Tell us about the project.
            </h2>
            <p style={{ color: 'var(--text-dim)', margin: '0 0 22px' }}>Helps us match you with the right specialist.</p>

            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 8 }}>Use case</label>
            <div className="tile-row" style={{ marginBottom: 18 }}>
              {USE_CASES.map(u => (
                <button key={u.id} className={cls('tile', form.useCase === u.id && 'selected')} onClick={() => set('useCase', u.id)}>
                  {u.label}
                </button>
              ))}
            </div>

            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-mute)', marginBottom: 8 }}>Timeline</label>
            <div className="tile-row" style={{ marginBottom: 18 }}>
              {['Immediate', '1-3 mo', '3-6 mo', '6+ mo', 'Just exploring'].map(t => (
                <button key={t} className={cls('tile', form.timeline === t && 'selected')} onClick={() => set('timeline', t)}>
                  {t}
                </button>
              ))}
            </div>

            <div className="form-field">
              <label>City</label>
              <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="e.g. Mumbai" />
            </div>
            <div className="form-field">
              <label>Anything else?</label>
              <textarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="Floor area, specific concerns, brand mix..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600, margin: '0 0 8px' }}>
              Review & send
            </h2>
            <p style={{ color: 'var(--text-dim)', margin: '0 0 22px' }}>We'll attach your catalog as a PDF and forward to the right specialist.</p>

            <div style={{ padding: 18, background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', marginBottom: 14 }}>
              <div className="section-h" style={{ margin: '0 0 10px' }}>Contact</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>{form.name || '—'}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>{form.email || '—'} · {form.phone || '—'}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>{form.org || '—'}{form.city ? ` · ${form.city}` : ''}</div>
            </div>
            <div style={{ padding: 18, background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)', marginBottom: 14 }}>
              <div className="section-h" style={{ margin: '0 0 10px' }}>Project</div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase' }}>Use case</div>
                  <div style={{ marginTop: 2, fontWeight: 500 }}>{USE_CASES.find(u => u.id === form.useCase)?.label}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-mute)', textTransform: 'uppercase' }}>Timeline</div>
                  <div style={{ marginTop: 2, fontWeight: 500 }}>{form.timeline}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: 18, background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}>
              <div className="section-h" style={{ margin: '0 0 10px' }}>Catalog · {items.length} items</div>
              {items.length === 0 ? (
                <div style={{ color: 'var(--text-dim)' }}>No items yet — we'll discuss requirements directly.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {items.slice(0, 5).map(it => (
                    <div key={it.p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span>{it.p.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>× {it.qty}</span>
                    </div>
                  ))}
                  {items.length > 5 && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)' }}>+ {items.length - 5} more</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {submitted && (
          <div className="cat-empty" style={{ paddingTop: 50 }}>
            <div className="ico" style={{ background: 'var(--accent)', border: 'none' }}>
              <Icon name="check" size={36} stroke="#fff" sw={2.2} />
            </div>
            <h2>Request received.</h2>
            <p>A specialist will reach out within 24 hours. We've sent a confirmation to <strong style={{ color: 'var(--text)' }}>{form.email || 'your email'}</strong>.</p>
            <button className="btn-primary" onClick={onBack}>Back to catalog</button>
          </div>
        )}
      </div>

      {!submitted && (
        <div className="detail-actionbar">
          {step > 0 && <button className="btn-ghost" onClick={() => setStep(s => s - 1)}><Icon name="arrow-left" size={18} /></button>}
          <button
            className="btn-primary"
            onClick={() => {
              if (step === 0 && !form.name) return;
              setStep(s => s + 1);
            }}
          >
            {step === 2 ? 'Send request' : 'Continue'}
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TopBar, FeedHero, ChipRow, ProductCard, ProductCardDesktop, FilterSheet, ProductDetail, CatalogScreen, EnquiryScreen, useCatalog, useLocalState, cls });
