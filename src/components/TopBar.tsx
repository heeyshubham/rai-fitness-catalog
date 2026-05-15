import Icon from './Icon';

interface TopBarProps {
  onCatalog: () => void;
  catalogCount: number;
  onSearch: () => void;
}

export default function TopBar({ onCatalog, catalogCount, onSearch }: TopBarProps) {
  return (
    <header className="desk:hidden sticky top-0 z-30 flex items-center justify-between px-5 pb-3 topbar-pad bg-gradient-to-b from-bg/[1] to-bg/0 backdrop-blur-[12px]">
      {/* brand */}
      <div className="flex items-center gap-[10px] font-display font-bold tracking-[-0.02em] text-[19px]">
        <div className="w-[30px] h-[30px] rounded-[9px] bg-accent grid place-items-center text-white font-display font-extrabold text-[16px]">R</div>
        <div>
          <div className="leading-none">Rai Fitness</div>
          <small className="font-mono text-[9px] tracking-[0.18em] text-text-dim uppercase block leading-none mt-[2px]">EST · 1986 · INDIA</small>
        </div>
      </div>

      {/* actions */}
      <div className="flex items-center gap-[10px]">
        <button
          className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95 relative"
          onClick={onSearch}
          aria-label="Search"
        >
          <Icon name="search" size={18} />
        </button>
        <button
          className="w-[42px] h-[42px] rounded-[14px] bg-surface grid place-items-center border border-line transition-[transform,background] duration-150 text-text hover:bg-surface-2 active:scale-95 relative"
          onClick={onCatalog}
          aria-label="Catalog"
        >
          <Icon name="folder" size={18} />
          {catalogCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-[5px] rounded-[9px] bg-accent text-white font-mono text-[10px] font-semibold grid place-items-center border-2 border-bg">
              {catalogCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
