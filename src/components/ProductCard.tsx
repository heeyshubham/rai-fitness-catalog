import Image from 'next/image';
import { CATEGORIES, MUSCLES } from '@/data';
import type { CatalogState, Product } from '@/types';
import Icon from './Icon';
import Silhouette from './Silhouette';

function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

interface ProductCardProps {
  p: Product;
  onOpen: () => void;
  catalog: CatalogState;
}

export default function ProductCard({ p, onOpen, catalog }: ProductCardProps) {
  const inCat = catalog.has(p.id);
  const cat = CATEGORIES.find(c => c.id === p.category);

  return (
    <article
      className="relative rounded-xl bg-surface border border-line overflow-hidden cursor-pointer transition-[transform,background] duration-200 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] hover:bg-surface-2 active:scale-[0.99]"
      onClick={onOpen}
    >
      {/* media */}
      <div className={cls(
        'relative [aspect-ratio:4/3.4] overflow-hidden',
        p.photo ? 'bg-[#ece8de]' : 'bg-surface-2'
      )}>
        {p.photo
          ? <Image src={p.photo} alt={p.name} fill style={{ objectFit: 'contain', padding: '12px' }} sizes="(max-width: 880px) 100vw, 400px" />
          : <Silhouette kind={p.silhouette} hue={p.hue} label={p.code} />
        }
        {/* badge row */}
        <div className="absolute top-[14px] left-[14px] right-[14px] flex justify-between items-start z-[2]">
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[6px] rounded-full bg-[rgba(20,16,14,0.65)] backdrop-blur-[8px] border border-white/[0.08] font-mono text-[10px] tracking-[0.08em] uppercase text-text">
            <span className="w-[6px] h-[6px] rounded-full bg-accent" />
            {cat?.label || p.category}
          </span>
        </div>
      </div>

      {/* body */}
      <div className="px-[18px] pt-4 pb-[18px]">
        <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em] m-0 leading-[1.1] break-words">
          {p.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-text-dim text-[13px]">
            {p.muscles.slice(0, 2).map(m => MUSCLES.find(x => x.id === m)?.label).join(' · ')}
          </span>
          <span className="font-mono text-[12px] text-text-dim tracking-[0.04em]">{p.code}</span>
        </div>

        {/* meta row */}
        <div className="flex gap-[14px] flex-wrap mt-[14px] pt-[14px] border-t border-line">
          <div className="font-mono text-[11px] text-text-mute tracking-[0.02em]">
            CAPACITY <strong className="block text-text font-body font-medium text-[13px] mt-[2px] tracking-[-0.005em]">{p.capacity}</strong>
          </div>
          <div className="font-mono text-[11px] text-text-mute tracking-[0.02em]">
            FOOTPRINT <strong className="block text-text font-body font-medium text-[13px] mt-[2px] tracking-[-0.005em]">{p.footprint}</strong>
          </div>
          <div className="font-mono text-[11px] text-text-mute tracking-[0.02em]">
            SERIES <strong className="block text-text font-body font-medium text-[13px] mt-[2px] tracking-[-0.005em]">{p.series.replace(' Series', '')}</strong>
          </div>
        </div>

        {/* add button */}
        <button
          className={cls(
            'flex items-center gap-[10px] w-full mt-4 px-[14px] py-[14px] pl-4 rounded-full font-semibold text-[14px] tracking-[-0.005em] transition-[transform,background,box-shadow] duration-150 whitespace-nowrap min-w-0',
            inCat
              ? 'bg-text text-bg [box-shadow:0_8px_20px_-10px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.06)_inset]'
              : 'bg-accent text-white [box-shadow:0_10px_24px_-10px_rgba(230,57,70,0.55),0_0_0_1px_rgba(255,255,255,0.06)_inset] hover:bg-[#d12e3c] hover:-translate-y-px active:scale-[0.985]'
          )}
          onClick={(e) => {
            e.stopPropagation();
            inCat ? catalog.remove(p.id) : catalog.add(p.id);
          }}
          aria-label={inCat ? 'Remove from catalog' : 'Add to catalog'}
        >
          <span className={cls(
            'w-[28px] h-[28px] rounded-full grid place-items-center flex-shrink-0',
            inCat ? 'bg-black/[0.12]' : 'bg-white/[0.18]'
          )}>
            <Icon name={inCat ? 'check' : 'plus'} size={18} sw={2} />
          </span>
          <span className="flex-1 text-left">{inCat ? 'Added to Catalog' : 'Add to Catalog'}</span>
          {!inCat && (
            <span className="w-[28px] h-[28px] rounded-full grid place-items-center opacity-85 transition-transform duration-[180ms] group-hover:translate-x-[2px] flex-shrink-0">
              <Icon name="arrow-right" size={16} sw={2} />
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
