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
    <div className="pdf-preview">
      <div className="pdf-h">
        <div>
          <div className="ti">Quotation Request</div>
          <div className="sub">RAI FITNESS · {today}</div>
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
    <div className="detail">
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
            <p>Tap the + on any machine to start building your floor plan. We&apos;ll turn it into a tailored PDF quote.</p>
            <button className="btn-primary" onClick={onBack}>Browse machines</button>
          </div>
        ) : (
          <>
            {items.map(({ p, qty }) => (
              <div key={p.id} className="cat-row">
                <div className="thumb" onClick={() => onOpen(p.id)} style={{ cursor: 'pointer', position: 'relative' }}>
                  {p.photo
                    ? <Image src={p.photo} alt={p.name} fill style={{ objectFit: 'contain', padding: '4px' }} sizes="72px" />
                    : <Silhouette kind={p.silhouette} hue={p.hue} />
                  }
                </div>
                <div className="info" onClick={() => onOpen(p.id)} style={{ cursor: 'pointer' }}>
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
                  Generate PDF &amp; Request Quote
                </button>
                <button className="btn-block"><Icon name="share" size={16} /> Share catalog link</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
