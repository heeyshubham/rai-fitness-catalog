import Icon from './Icon';

interface TopBarProps {
  onCatalog: () => void;
  catalogCount: number;
  onSearch: () => void;
}

export default function TopBar({ onCatalog, catalogCount, onSearch }: TopBarProps) {
  return (
    <header className="topbar mobile-only">
      <div className="brand">
        <div className="brand-mark">R</div>
        <div>
          <div style={{ lineHeight: 1 }}>Rai Fitness</div>
          <small>EST · 1986 · INDIA</small>
        </div>
      </div>
      <div className="row">
        <button className="icon-btn" onClick={onSearch} aria-label="Search">
          <Icon name="search" size={18} />
        </button>
        <button className="icon-btn" onClick={onCatalog} aria-label="Catalog">
          <Icon name="folder" size={18} />
          {catalogCount > 0 && <span className="count-badge">{catalogCount}</span>}
        </button>
      </div>
    </header>
  );
}
