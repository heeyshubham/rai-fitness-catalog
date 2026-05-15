import { MUSCLES, USE_CASES } from '@/data';
import type { Filters } from '@/types';
import Icon from './Icon';

function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (fn: (prev: Filters) => Filters) => void;
  productCount: number;
}

const optBase =
  'px-[14px] py-[10px] rounded-full bg-surface border border-line text-text text-[13px] font-medium inline-flex items-center gap-2 transition-all duration-150 cursor-pointer hover:bg-surface-2';

export default function FilterSheet({ open, onClose, filters, setFilters, productCount }: FilterSheetProps) {
  if (!open) return null;

  const toggle = (key: 'muscles' | 'useCases', val: string) => {
    setFilters(p => {
      const cur = p[key] || [];
      const next = cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val];
      return { ...p, [key]: next };
    });
  };

  const reset = () => setFilters(() => ({ muscles: [], useCases: [], capacityMax: 500, sort: 'Featured' }));

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[80] animate-fade-in sheet-overlay-desk"
        onClick={onClose}
      />
      {/* sheet */}
      <div
        className="fixed left-0 right-0 bottom-0 z-[81] bg-bg-2 rounded-[28px_28px_0_0] max-h-[88vh] overflow-y-auto overscroll-contain animate-sheet-up border-t border-line sheet-desk"
        role="dialog"
      >
        {/* handle */}
        <div className="w-[38px] h-1 rounded-sm bg-line-strong mx-auto mt-[10px] mb-4" />

        {/* header */}
        <div className="px-[22px] pb-[18px] flex items-center justify-between border-b border-line">
          <div>
            <h3 className="font-display text-[24px] font-semibold tracking-[-0.02em] m-0">Refine</h3>
            <div className="font-mono text-[11px] text-text-mute tracking-[0.06em] mt-1">
              {productCount} MACHINES MATCH
            </div>
          </div>
          <button
            className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95"
            onClick={onClose}
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* body */}
        <div className="p-[22px]">
          {/* Muscle group */}
          <div className="mb-[26px]">
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-display text-[17px] font-semibold tracking-[-0.015em]">Muscle Group</div>
              <div className="font-mono text-[11px] text-text-mute tracking-[0.08em] uppercase">{filters.muscles?.length || 0} SELECTED</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {MUSCLES.map(m => (
                <button
                  key={m.id}
                  className={cls(
                    optBase,
                    filters.muscles?.includes(m.id) && 'bg-text !text-bg border-text'
                  )}
                  onClick={() => toggle('muscles', m.id)}
                >
                  <span className={cls(
                    'w-[14px] h-[14px] rounded-full border-[1.5px] border-current grid place-items-center',
                    filters.muscles?.includes(m.id) ? 'opacity-100' : 'opacity-50'
                  )}>
                    {filters.muscles?.includes(m.id) && (
                      <span className="w-[6px] h-[6px] rounded-full bg-bg" />
                    )}
                  </span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Use case */}
          <div className="mb-[26px]">
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-display text-[17px] font-semibold tracking-[-0.015em]">Use Case</div>
              <div className="font-mono text-[11px] text-text-mute tracking-[0.08em] uppercase">{filters.useCases?.length || 0} SELECTED</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {USE_CASES.map(u => (
                <button
                  key={u.id}
                  className={cls(
                    optBase,
                    filters.useCases?.includes(u.id) && 'bg-text !text-bg border-text'
                  )}
                  onClick={() => toggle('useCases', u.id)}
                >
                  <span className={cls(
                    'w-[14px] h-[14px] rounded-full border-[1.5px] border-current grid place-items-center',
                    filters.useCases?.includes(u.id) ? 'opacity-100' : 'opacity-50'
                  )}>
                    {filters.useCases?.includes(u.id) && (
                      <span className="w-[6px] h-[6px] rounded-full bg-bg" />
                    )}
                  </span>
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max capacity */}
          <div className="mb-[26px]">
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-display text-[17px] font-semibold tracking-[-0.015em]">Max Capacity</div>
              <div className="font-mono text-[11px] text-text-mute tracking-[0.08em] uppercase">{filters.capacityMax || 500} KG</div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range" min="100" max="500" step="10"
                value={filters.capacityMax || 500}
                onChange={(e) => setFilters(p => ({ ...p, capacityMax: +e.target.value }))}
                className="slider flex-1 h-[6px] rounded-[3px] bg-surface-3 outline-none"
              />
              <span className="font-mono text-[13px] text-text min-w-[80px]">{filters.capacityMax || 500} kg</span>
            </div>
          </div>

          {/* Sort */}
          <div className="mb-[26px]">
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-display text-[17px] font-semibold tracking-[-0.015em]">Sort by</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Featured', 'Newest', 'A–Z', 'Capacity'].map(s => (
                <button
                  key={s}
                  className={cls(
                    optBase,
                    (filters.sort || 'Featured') === s && 'bg-text !text-bg border-text'
                  )}
                  onClick={() => setFilters(p => ({ ...p, sort: s }))}
                >
                  <span className={cls(
                    'w-[14px] h-[14px] rounded-full border-[1.5px] border-current grid place-items-center',
                    (filters.sort || 'Featured') === s ? 'opacity-100' : 'opacity-50'
                  )}>
                    {(filters.sort || 'Featured') === s && (
                      <span className="w-[6px] h-[6px] rounded-full bg-bg" />
                    )}
                  </span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="sticky bottom-0 px-[22px] pt-4 bg-gradient-to-b from-transparent to-bg-2/[1] flex gap-[10px] sheet-actions-pad">
          <button
            className="flex items-center justify-center gap-[10px] px-[18px] py-[14px] rounded-md bg-surface border border-line font-medium text-[14px] w-full transition-all duration-150 hover:bg-surface-2"
            onClick={reset}
          >
            Reset
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center gap-[10px] px-[22px] py-4 rounded-full bg-accent text-white font-semibold text-[15px] transition-[transform,background] duration-150 hover:bg-[#d12e3c] active:scale-[0.985]"
            onClick={onClose}
          >
            Show {productCount} results
          </button>
        </div>
      </div>
    </>
  );
}
