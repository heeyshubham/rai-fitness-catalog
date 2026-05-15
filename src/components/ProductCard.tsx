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
    <article className="card" onClick={onOpen}>
      <div className={cls('card-media', p.photo && 'card-media--lit')}>
        {p.photo
          ? <Image src={p.photo} alt={p.name} fill style={{ objectFit: 'contain', padding: '12px' }} sizes="(max-width: 880px) 100vw, 400px" />
          : <Silhouette kind={p.silhouette} hue={p.hue} label={p.code} />
        }
        <div className="badge-row">
          <span className="cat-tag">
            <span className="dot" />
            {cat?.label || p.category}
          </span>
        </div>
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <div className="sub">
          <span className="muscle">
            {p.muscles.slice(0, 2).map(m => MUSCLES.find(x => x.id === m)?.label).join(' · ')}
          </span>
          <span className="price">{p.code}</span>
        </div>
        <div className="card-meta">
          <div className="meta">CAPACITY <strong>{p.capacity}</strong></div>
          <div className="meta">FOOTPRINT <strong>{p.footprint}</strong></div>
          <div className="meta">SERIES <strong>{p.series.replace(' Series', '')}</strong></div>
        </div>
        <button
          className={cls('card-add-btn', inCat && 'added')}
          onClick={(e) => {
            e.stopPropagation();
            inCat ? catalog.remove(p.id) : catalog.add(p.id);
          }}
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
