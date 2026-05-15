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
    </>
  );
}
