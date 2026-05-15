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

  const hasPhoto = images.some(im => im.src);

  const heroClass = cls(
    'relative h-[62vh] min-h-[480px] max-[879px]:h-[55vh] max-[879px]:min-h-[280px] desk:h-[56vh] detail-hero-offset overflow-hidden detail-hero-after',
    hasPhoto ? 'bg-[#ece8de] detail-hero-after-lit' : 'bg-surface'
  );

  if (images.length === 1) {
    return (
      <div className={heroClass} style={{ position: 'relative' }}>
        {images[0].src
          ? <Image src={images[0].src} alt={images[0].label || p.name} fill style={{ objectFit: 'contain', padding: '24px' }} sizes="100vw" priority />
          : <Silhouette kind={images[0].silhouette} hue={images[0].hue} label={images[0].label || p.code} />
        }
      </div>
    );
  }

  return (
    <div className={heroClass}>
      {/* rail */}
      <div
        ref={railRef}
        className="hero-rail absolute inset-0 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none"
      >
        {images.map((im, i) => (
          <div key={i} className="flex-[0_0_100%] snap-start relative h-full">
            {im.src
              ? <Image src={im.src} alt={im.label || p.name} fill style={{ objectFit: 'contain', padding: '24px' }} sizes="100vw" priority={i === 0} />
              : <Silhouette kind={im.silhouette} hue={im.hue} label={im.label} />
            }
          </div>
        ))}
      </div>

      {/* counter */}
      <div className="absolute top-[80px] right-5 z-[3] px-3 py-[6px] rounded-full bg-[rgba(20,16,14,0.6)] backdrop-blur-[10px] border border-white/[0.06] inline-flex items-center gap-[6px] font-mono text-[10px] tracking-[0.1em] text-text uppercase">
        <span>{String(active + 1).padStart(2, '0')}</span>
        <span className="opacity-40">/</span>
        <span className="opacity-60">{String(images.length).padStart(2, '0')}</span>
        {images[active]?.label && (
          <span className="ml-2 pl-2 border-l border-white/[0.18] text-text-dim tracking-[0.04em] normal-case">
            {images[active].label}
          </span>
        )}
      </div>

      {/* dots */}
      <div className="absolute bottom-[100px] left-0 right-0 z-[3] flex justify-center gap-[6px] pointer-events-none">
        {images.map((_, i) => (
          <button
            key={i}
            className={cls(
              'pointer-events-auto h-1 rounded-[2px] transition-[background,width] duration-200',
              active === i ? 'w-[30px] bg-text' : 'w-[22px] bg-white/25'
            )}
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
  onCatalog: () => void;
}

export default function ProductDetail({ p, onClose, catalog, onOpen, onTalk, onCatalog }: ProductDetailProps) {
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
    <div
      className={cls('fixed inset-0 z-50 bg-bg overflow-y-auto overflow-x-hidden overscroll-contain animate-rise desk:fixed', scrolled && 'is-scrolled')}
      ref={scrollRef}
      role="dialog"
    >
      {/* sticky topbar */}
      <div className="detail-topbar-inner sticky top-0 z-10 bg-transparent flex items-center justify-between px-5 pb-[18px] detail-topbar-pad">
        <button onClick={onClose} className="w-[42px] h-[42px] rounded-[14px] bg-[rgba(20,16,14,0.55)] backdrop-blur-[10px] border border-white/[0.06] grid place-items-center transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95 [.is-scrolled_&]:bg-surface [.is-scrolled_&]:border-line">
          <Icon name="arrow-left" size={18} />
        </button>
        <div className="flex items-center gap-[10px]">
          <button className="w-[42px] h-[42px] rounded-[14px] bg-[rgba(20,16,14,0.55)] backdrop-blur-[10px] border border-white/[0.06] grid place-items-center transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95 [.is-scrolled_&]:bg-surface [.is-scrolled_&]:border-line">
            <Icon name="share" size={18} />
          </button>
          <button className="w-[42px] h-[42px] rounded-[14px] bg-[rgba(20,16,14,0.55)] backdrop-blur-[10px] border border-white/[0.06] grid place-items-center transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95 [.is-scrolled_&]:bg-surface [.is-scrolled_&]:border-line">
            <Icon name="heart" size={18} />
          </button>
        </div>
      </div>

      <ProductHero p={p} />

      {/* body */}
      <div className="px-5 pt-6 relative z-[2] -mt-[80px] desk:max-w-[760px] desk:mx-auto detail-body-pad">
        <h1 className="font-display text-[clamp(28px,9vw,40px)] font-bold tracking-[-0.03em] leading-none m-0 [text-wrap:balance] break-words">
          {p.name}
        </h1>

        <div className="flex items-center flex-wrap gap-2 mt-[14px] font-mono text-[11px] tracking-[0.08em] uppercase text-text-dim">
          <span className="px-[10px] py-1 rounded-full bg-accent-tint text-accent border border-[rgba(230,57,70,0.2)]">
            {cat?.label}
          </span>
          <span>· {p.series}</span>
          <span>· {p.code}</span>
        </div>

        {/* muscles */}
        <div className="flex gap-2 mt-[18px] flex-wrap">
          {p.muscles.map(m => (
            <span
              key={m}
              className="px-3 py-2 rounded-full bg-text text-bg border border-text text-[12px] font-medium inline-flex items-center gap-2 pointer-events-none"
            >
              <span className="w-[14px] h-[14px] rounded-full border-[1.5px] border-current grid place-items-center opacity-100">
                <span className="w-[6px] h-[6px] rounded-full bg-bg" />
              </span>
              {MUSCLES.find(x => x.id === m)?.label}
            </span>
          ))}
        </div>

        {/* section: overview */}
        <div className="section-h font-mono text-[11px] tracking-[0.12em] uppercase text-text-mute mt-8 mb-[14px] flex items-center gap-2">Overview</div>
        <p className="text-[16px] leading-[1.55] text-text-dim [text-wrap:pretty] m-0">
          {p.description}
        </p>

        {/* section: specs */}
        <div className="section-h font-mono text-[11px] tracking-[0.12em] uppercase text-text-mute mt-8 mb-[14px] flex items-center gap-2">Specifications</div>
        <div className="grid grid-cols-2 gap-px bg-line rounded-md overflow-hidden border border-line">
          {[
            { k: 'Resistance', v: p.weightStack },
            {
              k: 'Max Capacity',
              v: p.capacity.split(' ')[0],
              small: p.capacity.split(' ').slice(1).join(' ') || 'kg'
            },
            {
              k: 'Footprint',
              v: p.footprint.split(' ')[0],
              small: p.footprint.split(' ').slice(1).join(' ')
            },
            {
              k: 'Unit Weight',
              v: p.weight.split(' ')[0],
              small: p.weight.split(' ').slice(1).join(' ')
            },
            { k: 'Finish', v: p.color, bodyFont: true },
            { k: 'Warranty', v: '10', small: 'YEAR FRAME' },
          ].map((cell) => (
            <div key={cell.k} className="bg-bg p-4">
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-mute">{cell.k}</div>
              <div className={cls(
                'font-display text-[22px] font-semibold tracking-[-0.015em] mt-1',
                cell.bodyFont && 'font-body font-medium text-[15px]'
              )}>
                {cell.v}
                {cell.small && (
                  <small className="font-mono text-[11px] text-text-dim font-normal ml-1 tracking-[0.04em]">{cell.small}</small>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* section: features */}
        <div className="section-h font-mono text-[11px] tracking-[0.12em] uppercase text-text-mute mt-8 mb-[14px] flex items-center gap-2">Build &amp; Features</div>
        <ul className="list-none m-0 p-0 flex flex-col gap-3">
          {p.features.map((f, i) => (
            <li key={i} className="flex gap-3 items-start px-4 py-[14px] bg-surface rounded-md border border-line">
              <div className="font-mono text-[10px] text-accent tracking-[0.08em] flex-shrink-0 mt-[3px]">0{i + 1}</div>
              <div>
                <strong className="block font-medium mb-[2px]">{f.t}</strong>
                <span className="text-text-dim text-[13px]">{f.d}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* section: use cases */}
        <div className="section-h font-mono text-[11px] tracking-[0.12em] uppercase text-text-mute mt-8 mb-[14px] flex items-center gap-2">Best for</div>
        <div className="flex flex-wrap gap-2">
          {p.use.map(u => (
            <span
              key={u}
              className="px-[14px] py-[10px] rounded-full bg-surface border border-line text-text text-[13px] font-medium inline-flex items-center gap-2 pointer-events-none"
            >
              {USE_CASES.find(x => x.id === u)?.label}
            </span>
          ))}
        </div>

        {/* expert CTA */}
        <div
          className="mt-7 p-[22px] rounded-lg bg-gradient-to-br from-surface-2 to-surface border border-line flex gap-4 items-center overflow-hidden cursor-pointer"
          onClick={onTalk}
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e63946] to-[#b32e3a] flex-shrink-0 grid place-items-center font-display font-bold text-white text-[22px] border-2 border-surface">
            A
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="font-display text-[18px] font-semibold tracking-[-0.015em]">Talk to a specialist</div>
            <div className="text-[13px] text-text-dim mt-[2px] overflow-hidden text-ellipsis whitespace-nowrap">
              Get a tailored quote for {p.name} →
            </div>
          </div>
          <div className="ml-auto w-10 h-10 rounded-[14px] bg-text text-bg grid place-items-center flex-shrink-0">
            <Icon name="arrow-up-right" size={18} />
          </div>
        </div>

        {/* related */}
        <div className="section-h font-mono text-[11px] tracking-[0.12em] uppercase text-text-mute mt-8 mb-[14px] flex items-center gap-2">You may also like</div>
        <div className="related-row-scroll flex gap-3 overflow-x-auto -mx-5 px-5 py-1 scrollbar-none">
          {related.map(r => (
            <div
              key={r.id}
              className="flex-[0_0_220px] bg-surface rounded-lg overflow-hidden border border-line cursor-pointer"
              onClick={() => onOpen(r.id)}
            >
              <div className="[aspect-ratio:4/3] bg-surface-2 relative">
                {r.photo
                  ? <Image src={r.photo} alt={r.name} fill style={{ objectFit: 'contain', padding: '8px' }} sizes="220px" />
                  : <Silhouette kind={r.silhouette} hue={r.hue} />
                }
              </div>
              <div className="p-3 px-[14px]">
                <h4 className="m-0 font-display text-[15px] font-semibold tracking-[-0.015em]">{r.name}</h4>
                <div className="font-mono text-[10px] text-text-mute tracking-[0.08em] uppercase mt-1">
                  {CATEGORIES.find(c => c.id === r.category)?.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* action bar */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pt-[14px] bg-gradient-to-b from-transparent to-bg/[1] z-[60] flex gap-[10px] items-center detail-bar-pad">
        <button
          className="w-[54px] h-[54px] rounded-full bg-surface border border-line grid place-items-center flex-shrink-0"
          onClick={onTalk}
          aria-label="Talk to expert"
        >
          <Icon name="message" size={20} />
        </button>
        {inCat ? (
          <button
            className="flex-1 inline-flex items-center justify-center gap-[10px] px-[22px] py-4 rounded-full bg-text text-bg font-semibold text-[15px] transition-[transform,background] duration-150 active:scale-[0.985]"
            onClick={onCatalog}
          >
            <Icon name="folder" size={18} />
            View · {catalog.count} {catalog.count === 1 ? 'item' : 'items'} added
            <Icon name="arrow-right" size={16} />
          </button>
        ) : (
          <button
            className="flex-1 inline-flex items-center justify-center gap-[10px] px-[22px] py-4 rounded-full bg-accent text-white font-semibold text-[15px] transition-[transform,background] duration-150 hover:bg-[#d12e3c] active:scale-[0.985]"
            onClick={() => catalog.add(p.id)}
          >
            <Icon name="plus" size={18} />
            Add to Catalog
          </button>
        )}
      </div>
    </div>
  );
}
