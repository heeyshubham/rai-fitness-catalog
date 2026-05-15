import Image from 'next/image';
import { PRODUCTS, CATEGORIES } from '@/data';
import type { CatalogState } from '@/types';
import Icon from './Icon';
import Silhouette from './Silhouette';

interface PdfPreviewProps {
  items: Array<{ p: (typeof PRODUCTS)[0]; qty: number }>;
}

function PdfPreview({ items }: PdfPreviewProps) {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="bg-[#f5f1e8] text-[#1a1614] rounded-md p-[22px] font-body mt-[10px]">
      {/* header */}
      <div className="flex justify-between items-start border-b border-[#d8d0c2] pb-[14px] mb-[14px]">
        <div>
          <div className="font-display text-[20px] font-bold tracking-[-0.02em]">Quotation Request</div>
          <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#7a7065] mt-[2px]">RAI FITNESS · {today}</div>
        </div>
        <div className="w-9 h-9 rounded-[10px] bg-accent text-white grid place-items-center font-display font-extrabold">R</div>
      </div>
      {items.slice(0, 4).map((it, i) => (
        <div key={it.p.id} className="grid [grid-template-columns:24px_1fr_auto] gap-3 py-[10px] border-b border-dashed border-[#d8d0c2] text-[13px]">
          <span className="font-mono text-[10px] text-[#7a7065] tracking-[0.06em]">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <strong className="block">{it.p.name}</strong>
            <small className="font-mono text-[10px] text-[#7a7065] tracking-[0.06em] uppercase">{it.p.code}</small>
          </div>
          <span className="font-mono text-[12px] text-[#4a4036]">× {it.qty}</span>
        </div>
      ))}
      {items.length > 4 && (
        <div className="pt-2 font-mono text-[11px] text-[#7a7065] text-center">
          + {items.length - 4} more items
        </div>
      )}
    </div>
  );
}

interface CatalogScreenProps {
  catalog: CatalogState;
  onBack: () => void;
  onOpen: (id: string) => void;
  onEnquire: () => void;
}

export default function CatalogScreen({ catalog, onBack, onOpen, onEnquire }: CatalogScreenProps) {
  const items = Object.entries(catalog.items)
    .map(([id, qty]) => ({ p: PRODUCTS.find(x => x.id === id)!, qty }))
    .filter(x => x.p);

  return (
    <div className="fixed inset-0 z-50 bg-bg overflow-y-auto overflow-x-hidden overscroll-contain animate-rise">
      {/* topbar */}
      <div className="sticky top-0 bg-bg z-[6] flex items-center justify-between px-5 py-[18px]">
        <button
          className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95"
          onClick={onBack}
        >
          <Icon name="arrow-left" size={18} />
        </button>
        <div className="text-center flex-1">
          <div className="font-display text-[18px] font-semibold">Your Catalog</div>
          <div className="font-mono text-[10px] tracking-[0.1em] text-text-mute uppercase">
            {items.length} machines · {catalog.count} units
          </div>
        </div>
        <button
          className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95"
        >
          <Icon name="share" size={18} />
        </button>
      </div>

      {/* content */}
      <div className="px-5 cat-page-pad">
        {items.length === 0 ? (
          <div className="py-20 text-center px-5">
            <div className="w-[80px] h-[80px] mx-auto mb-[18px] rounded-[24px] bg-surface border border-line grid place-items-center">
              <Icon name="folder" size={32} stroke="var(--text-dim)" />
            </div>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em] m-0 mb-2">Your catalog is empty</h2>
            <p className="text-text-dim m-0 mb-[22px] max-w-[28ch] mx-auto">
              Tap the + on any machine to start building your floor plan. We&apos;ll turn it into a tailored PDF quote.
            </p>
            <button
              className="inline-flex items-center justify-center gap-[10px] px-[22px] py-4 rounded-full bg-accent text-white font-semibold text-[15px] transition-[transform,background] duration-150 hover:bg-[#d12e3c] active:scale-[0.985]"
              onClick={onBack}
            >
              Browse machines
            </button>
          </div>
        ) : (
          <>
            {items.map(({ p, qty }) => (
              <div
                key={p.id}
                className="flex items-center gap-[14px] p-[14px] bg-surface rounded-lg border border-line mb-[10px]"
              >
                <div
                  className="w-[72px] h-[72px] rounded-[16px] bg-surface-2 relative overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => onOpen(p.id)}
                >
                  {p.photo
                    ? <Image src={p.photo} alt={p.name} fill style={{ objectFit: 'contain', padding: '4px' }} sizes="72px" />
                    : <Silhouette kind={p.silhouette} hue={p.hue} />
                  }
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpen(p.id)}>
                  <h4 className="m-0 font-display text-[16px] font-semibold tracking-[-0.015em] whitespace-nowrap overflow-hidden text-ellipsis">
                    {p.name}
                  </h4>
                  <div className="font-mono text-[11px] text-text-mute tracking-[0.06em] uppercase mt-1">
                    {p.code} · {CATEGORIES.find(c => c.id === p.category)?.label}
                  </div>
                </div>
                {/* qty */}
                <div
                  className="flex items-center gap-1 bg-bg border border-line rounded-full p-1 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-[34px] h-[34px] rounded-full grid place-items-center text-text flex-shrink-0 hover:bg-surface-2"
                    onClick={() => catalog.setQty(p.id, qty - 1)}
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="font-mono text-[13px] min-w-[22px] text-center">{qty}</span>
                  <button
                    className="w-[34px] h-[34px] rounded-full grid place-items-center text-text flex-shrink-0 hover:bg-surface-2"
                    onClick={() => catalog.setQty(p.id, qty + 1)}
                  >
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* summary */}
            <div className="mt-[22px] p-[22px] rounded-lg bg-surface border border-line">
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-display text-[56px] font-bold tracking-[-0.04em] leading-[0.9]">{catalog.count}</div>
                  <div className="font-mono text-[11px] text-text-mute tracking-[0.08em] uppercase mt-[6px]">Units in catalog</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-[32px] font-bold tracking-[-0.04em] leading-[0.9] text-text-dim">{items.length}</div>
                  <div className="font-mono text-[11px] text-text-mute tracking-[0.08em] uppercase mt-[6px]">Distinct models</div>
                </div>
              </div>

              <div className="h-px bg-line my-[18px]" />
              <PdfPreview items={items} />

              <div className="mt-[18px] flex gap-[10px] flex-col">
                <button
                  className="inline-flex items-center justify-center gap-[10px] px-[22px] py-4 rounded-full bg-accent text-white font-semibold text-[15px] transition-[transform,background] duration-150 hover:bg-[#d12e3c] active:scale-[0.985]"
                  onClick={onEnquire}
                >
                  <Icon name="pdf" size={18} />
                  Generate PDF &amp; Request Quote
                </button>
                <button className="flex items-center justify-center gap-[10px] px-[18px] py-[14px] rounded-md bg-surface border border-line font-medium text-[14px] w-full transition-all duration-150 hover:bg-surface-2">
                  <Icon name="share" size={16} /> Share catalog link
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
