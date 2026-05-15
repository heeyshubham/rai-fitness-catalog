import { CATEGORIES } from '@/data';
import Icon from './Icon';

function cls(...args: (string | boolean | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

interface ChipRowProps {
  active: string;
  setActive: (id: string) => void;
  onFilter: () => void;
  counts: Record<string, number>;
  activeFilters: number;
}

const chipBase =
  'flex-shrink-0 px-[14px] py-[9px] rounded-full bg-surface border border-line text-text-dim text-[13px] font-medium whitespace-nowrap transition-all duration-150 scroll-snap-align-start inline-flex items-center gap-[6px]';

export default function ChipRow({ active, setActive, onFilter, counts, activeFilters }: ChipRowProps) {
  return (
    <div className="flex gap-2 px-5 desk:px-0 pt-[6px] pb-[18px] overflow-x-auto snap-x-proximity scrollbar-none chip-row">
      <button
        className={cls(chipBase, 'bg-transparent border-line-strong text-text')}
        onClick={onFilter}
      >
        <Icon name="sliders" size={14} />
        Filters
        {activeFilters > 0 && (
          <span className="font-mono text-[11px] opacity-70">·{activeFilters}</span>
        )}
      </button>
      {CATEGORIES.map(c => (
        <button
          key={c.id}
          className={cls(
            chipBase,
            active === c.id
              ? 'bg-text text-bg border-text'
              : 'hover:bg-surface-2 hover:text-text'
          )}
          onClick={() => setActive(c.id)}
        >
          {c.label}
          <span className="font-mono text-[11px] opacity-70">{counts[c.id] || 0}</span>
        </button>
      ))}
    </div>
  );
}
