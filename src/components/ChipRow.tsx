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

export default function ChipRow({ active, setActive, onFilter, counts, activeFilters }: ChipRowProps) {
  return (
    <div className="chip-row">
      <button className={cls('chip', 'filter-chip')} onClick={onFilter}>
        <Icon name="sliders" size={14} />
        Filters
        {activeFilters > 0 && <span className="chip-count">·{activeFilters}</span>}
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
