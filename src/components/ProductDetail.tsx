'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CATEGORIES, MUSCLES, USE_CASES, PRODUCTS } from '@/data';
import type { CatalogState, Product, ProductImage } from '@/types';
import Icon from './Icon';
import Silhouette from './Silhouette';

function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

interface ProductHeroProps {
  p: Product;
}

function ProductHero({ p }: ProductHeroProps) {
  const images: ProductImage[] = (p.images && p.images.length)
    ? p.images
    : [{ silhouette: p.silhouette, hue: p.hue, label: p.code }];

  const railRef = useRef<HTMLDivElement>(null);
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

  const goTo = (i: number) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  if (images.length === 1) {
    return (
      <div className="detail-hero" style={{ position: 'relative' }}>
        {images[0].src
          ? <Image src={images[0].src} alt={images[0].label || p.name} fill style={{ objectFit: 'contain', padding: '24px' }} sizes="100vw" priority />
          : <Silhouette kind={images[0].silhouette} hue={images[0].hue} label={images[0].label || p.code} />
        }
      </div>
    );
  }

  return (
    <div className="detail-hero">
      <div className="hero-rail" ref={railRef}>
        {images.map((im, i) => (
          <div key={i} className="hero-slide" style={{ position: 'relative' }}>
            {im.src
              ? <Image src={im.src} alt={im.label || p.name} fill style={{ objectFit: 'contain', padding: '24px' }} sizes="100vw" priority={i === 0} />
              : <Silhouette kind={im.silhouette} hue={im.hue} label={im.label} />
            }
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

interface ProductDetailProps {
  p: Product;
  onClose: () => void;
  catalog: CatalogState;
  onOpen: (id: string) => void;
  onTalk: () => void;
}

export default function ProductDetail({ p, onClose, catalog, onOpen, onTalk }: ProductDetailProps) {
  const inCat = catalog.has(p.id);
  const cat = CATEGORIES.find(c => c.id === p.category);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 40);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [p.id]);

  const related = PRODUCTS.filter(x =>
    x.id !== p.id && (x.category === p.category || x.muscles.some(m => p.muscles.includes(m)))
  ).slice(0, 4);

  return (
    <div className={cls('detail', scrolled && 'is-scrolled')} ref={scrollRef} role="dialog">
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
            <div className="v">
              {p.capacity.split(' ')[0]}
              <small>{p.capacity.split(' ').slice(1).join(' ') || 'kg'}</small>
            </div>
          </div>
          <div className="spec-cell">
            <div className="k">Footprint</div>
            <div className="v">
              {p.footprint.split(' ')[0]}
              <small>{p.footprint.split(' ').slice(1).join(' ')}</small>
            </div>
          </div>
          <div className="spec-cell">
            <div className="k">Unit Weight</div>
            <div className="v">
              {p.weight.split(' ')[0]}
              <small>{p.weight.split(' ').slice(1).join(' ')}</small>
            </div>
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

        <div className="section-h">Build &amp; Features</div>
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
            <span key={u} className="opt" style={{ pointerEvents: 'none' }}>
              {USE_CASES.find(x => x.id === u)?.label}
            </span>
          ))}
        </div>

        <div className="expert-cta" onClick={onTalk} style={{ cursor: 'pointer' }}>
          <div className="av">A</div>
          <div className="expert-info">
            <div className="t1">Talk to a specialist</div>
            <div className="t2">Get a tailored quote for {p.name} →</div>
          </div>
          <div className="arrow"><Icon name="arrow-up-right" size={18} /></div>
        </div>

        <div className="section-h">You may also like</div>
        <div className="related-row">
          {related.map(r => (
            <div key={r.id} className="related-card" onClick={() => onOpen(r.id)}>
              <div className="related-media" style={{ position: 'relative' }}>
                {r.photo
                  ? <Image src={r.photo} alt={r.name} fill style={{ objectFit: 'contain', padding: '8px' }} sizes="220px" />
                  : <Silhouette kind={r.silhouette} hue={r.hue} />
                }
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
        <button className="btn-ghost" onClick={onTalk} aria-label="Talk to expert">
          <Icon name="message" size={20} />
        </button>
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
