interface IconProps {
  name: string;
  size?: number;
  stroke?: string;
  sw?: number;
}

export default function Icon({ name, size = 20, stroke = 'currentColor', sw = 1.6 }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="7" /><line x1="20" y1="20" x2="16" y2="16" /></svg>;
    case 'folder':
      return <svg {...common}><path d="M3 6 a2 2 0 0 1 2 -2 h4 l2 2 h8 a2 2 0 0 1 2 2 v10 a2 2 0 0 1 -2 2 h-14 a2 2 0 0 1 -2 -2 z" /></svg>;
    case 'plus':
      return <svg {...common}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
    case 'check':
      return <svg {...common}><polyline points="20 6 9 17 4 12" /></svg>;
    case 'minus':
      return <svg {...common}><line x1="5" y1="12" x2="19" y2="12" /></svg>;
    case 'arrow-left':
      return <svg {...common}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
    case 'arrow-right':
      return <svg {...common}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case 'arrow-up-right':
      return <svg {...common}><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>;
    case 'share':
      return <svg {...common}><path d="M4 12 v7 a1 1 0 0 0 1 1 h14 a1 1 0 0 0 1 -1 v-7" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>;
    case 'sliders':
      return <svg {...common}><line x1="4" y1="6" x2="20" y2="6" /><circle cx="14" cy="6" r="2.4" fill="currentColor" stroke="none" /><line x1="4" y1="12" x2="20" y2="12" /><circle cx="8" cy="12" r="2.4" fill="currentColor" stroke="none" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="16" cy="18" r="2.4" fill="currentColor" stroke="none" /></svg>;
    case 'message':
      return <svg {...common}><path d="M21 11.5 a8.38 8.38 0 0 1 -.9 3.8 8.5 8.5 0 0 1 -7.6 4.7 8.38 8.38 0 0 1 -3.8 -.9 L 3 21 l 1.9 -5.7 a 8.38 8.38 0 0 1 -.9 -3.8 8.5 8.5 0 0 1 4.7 -7.6 8.38 8.38 0 0 1 3.8 -.9 h.5 a 8.48 8.48 0 0 1 8 8 v.5z" /></svg>;
    case 'phone':
      return <svg {...common}><path d="M22 16.92 v3 a2 2 0 0 1 -2.18 2 19.79 19.79 0 0 1 -8.63 -3.07 19.5 19.5 0 0 1 -6 -6 19.79 19.79 0 0 1 -3.07 -8.67 A2 2 0 0 1 4.11 2 h3 a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1 -.45 2.11 L 8.09 9.91 a 16 16 0 0 0 6 6 l1.27 -1.27 a 2 2 0 0 1 2.11 -.45 12.84 12.84 0 0 0 2.81.7 A 2 2 0 0 1 22 16.92z" /></svg>;
    case 'x':
      return <svg {...common}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
    case 'trash':
      return <svg {...common}><polyline points="3 6 5 6 21 6" /><path d="M19 6 v14 a2 2 0 0 1 -2 2 H7 a2 2 0 0 1 -2 -2 V6 m3 0 V4 a2 2 0 0 1 2 -2 h4 a2 2 0 0 1 2 2 v2" /></svg>;
    case 'pdf':
      return <svg {...common}><path d="M14 2 H6 a2 2 0 0 0 -2 2 v16 a 2 2 0 0 0 2 2 h12 a 2 2 0 0 0 2 -2 V8 z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="9" y1="18" x2="13" y2="18" /></svg>;
    case 'grid':
      return <svg {...common}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
    case 'home':
      return <svg {...common}><path d="M3 12 L 12 3 L 21 12" /><path d="M5 10 v10 a 1 1 0 0 0 1 1 h12 a 1 1 0 0 0 1 -1 V10" /></svg>;
    case 'heart':
      return <svg {...common}><path d="M20.84 4.61 a 5.5 5.5 0 0 0 -7.78 0 L 12 5.67 l -1.06 -1.06 a 5.5 5.5 0 0 0 -7.78 7.78 l 1.06 1.06 L 12 21.23 l 7.78 -7.78 1.06 -1.06 a 5.5 5.5 0 0 0 0 -7.78z" /></svg>;
    case 'star':
      return <svg {...common}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none" /></svg>;
    case 'menu':
      return <svg {...common}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
    case 'sort':
      return <svg {...common}><path d="M3 6 h13" /><path d="M3 12 h10" /><path d="M3 18 h6" /><polyline points="17 15 20 18 17 21" /><line x1="20" y1="18" x2="13" y2="18" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="9" /></svg>;
  }
}
