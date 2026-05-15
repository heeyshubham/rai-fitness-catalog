interface SilhouetteProps {
  kind: string;
  hue?: number;
  label?: string;
}

export default function Silhouette({ kind, hue = 8, label }: SilhouetteProps) {
  const id = `${kind}-${hue}`;
  const stroke = 'rgba(245,241,232,0.62)';
  const strokeBold = 'rgba(245,241,232,0.85)';
  const accent = `oklch(0.65 0.18 ${hue})`;
  const sw = 2.4;

  const bg = (
    <defs>
      <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={`oklch(0.22 0.04 ${hue})`} />
        <stop offset="100%" stopColor={`oklch(0.14 0.03 ${hue})`} />
      </linearGradient>
      <linearGradient id={`spot-${id}`} x1="0.3" y1="0.2" x2="0.7" y2="0.8">
        <stop offset="0%" stopColor={`oklch(0.45 0.12 ${hue})`} stopOpacity="0.55" />
        <stop offset="100%" stopColor={`oklch(0.20 0.05 ${hue})`} stopOpacity="0" />
      </linearGradient>
      <pattern id={`stripes-${id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill="transparent" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="white" strokeOpacity="0.012" strokeWidth="1" />
      </pattern>
    </defs>
  );

  const sil = (() => {
    switch (kind) {
      case 'leg-press':
        return (
          <g>
            <line x1="60" y1="270" x2="340" y2="270" stroke={stroke} strokeWidth={sw} />
            <line x1="60" y1="278" x2="340" y2="278" stroke={stroke} strokeWidth={sw * 0.6} />
            <line x1="100" y1="270" x2="260" y2="100" stroke={stroke} strokeWidth={sw} />
            <line x1="115" y1="270" x2="275" y2="100" stroke={stroke} strokeWidth={sw} />
            <rect x="60" y="240" width="80" height="32" rx="6" stroke={stroke} fill="none" strokeWidth={sw} />
            <rect x="44" y="180" width="22" height="68" rx="6" stroke={stroke} fill="none" strokeWidth={sw} />
            <rect x="220" y="100" width="80" height="14" rx="3" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <rect x="232" y="86" width="56" height="18" rx="2" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth={sw} />
            <circle cx="180" cy="180" r="18" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="180" cy="180" r="10" stroke={stroke} fill="none" strokeWidth={sw * 0.7} />
            <circle cx="220" cy="200" r="14" stroke={stroke} fill="none" strokeWidth={sw} />
          </g>
        );
      case 'cable-cross':
        return (
          <g>
            <line x1="90" y1="280" x2="90" y2="60" stroke={strokeBold} strokeWidth={sw} />
            <line x1="310" y1="280" x2="310" y2="60" stroke={strokeBold} strokeWidth={sw} />
            <line x1="90" y1="60" x2="310" y2="60" stroke={stroke} strokeWidth={sw} />
            <line x1="60" y1="280" x2="340" y2="280" stroke={stroke} strokeWidth={sw} />
            <circle cx="120" cy="120" r="8" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="280" cy="120" r="8" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="120" cy="200" r="8" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="280" cy="200" r="8" stroke={stroke} fill="none" strokeWidth={sw} />
            <line x1="120" y1="128" x2="155" y2="240" stroke={accent} strokeWidth={sw * 0.7} />
            <line x1="280" y1="128" x2="245" y2="240" stroke={accent} strokeWidth={sw * 0.7} />
            <rect x="150" y="240" width="14" height="22" rx="3" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <rect x="236" y="240" width="14" height="22" rx="3" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <rect x="80" y="160" width="20" height="100" rx="2" stroke={stroke} fill="none" strokeWidth={sw} />
            <line x1="80" y1="180" x2="100" y2="180" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="80" y1="200" x2="100" y2="200" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="80" y1="220" x2="100" y2="220" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="80" y1="240" x2="100" y2="240" stroke={stroke} strokeWidth={sw * 0.5} />
            <rect x="300" y="160" width="20" height="100" rx="2" stroke={stroke} fill="none" strokeWidth={sw} />
            <line x1="300" y1="180" x2="320" y2="180" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="300" y1="200" x2="320" y2="200" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="300" y1="220" x2="320" y2="220" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="300" y1="240" x2="320" y2="240" stroke={stroke} strokeWidth={sw * 0.5} />
          </g>
        );
      case 'treadmill':
        return (
          <g>
            <rect x="80" y="200" width="240" height="20" rx="4" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <rect x="86" y="206" width="228" height="8" rx="2" fill={accent} fillOpacity="0.12" />
            <circle cx="86" cy="210" r="4" stroke={stroke} fill="none" strokeWidth={sw * 0.6} />
            <circle cx="314" cy="210" r="4" stroke={stroke} fill="none" strokeWidth={sw * 0.6} />
            <line x1="100" y1="200" x2="100" y2="80" stroke={strokeBold} strokeWidth={sw} />
            <line x1="160" y1="200" x2="160" y2="80" stroke={strokeBold} strokeWidth={sw} />
            <rect x="92" y="60" width="76" height="44" rx="4" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <line x1="98" y1="74" x2="160" y2="74" stroke={stroke} strokeWidth={sw * 0.6} />
            <line x1="98" y1="84" x2="140" y2="84" stroke={stroke} strokeWidth={sw * 0.6} />
            <circle cx="155" cy="92" r="3" fill={accent} />
            <line x1="110" y1="200" x2="200" y2="200" stroke={stroke} strokeWidth={sw * 0.6} />
            <line x1="150" y1="120" x2="220" y2="170" stroke={stroke} strokeWidth={sw} />
            <line x1="76" y1="222" x2="324" y2="222" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="86" y1="222" x2="86" y2="240" stroke={stroke} strokeWidth={sw} />
            <line x1="314" y1="222" x2="314" y2="240" stroke={stroke} strokeWidth={sw} />
          </g>
        );
      case 'rack':
        return (
          <g>
            <rect x="100" y="50" width="14" height="230" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <rect x="286" y="50" width="14" height="230" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <rect x="100" y="50" width="200" height="10" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <rect x="100" y="270" width="200" height="10" stroke={stroke} fill="none" strokeWidth={sw} />
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={`l${i}`} cx="107" cy={80 + i * 18} r="1.6" fill={stroke} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={`r${i}`} cx="293" cy={80 + i * 18} r="1.6" fill={stroke} />
            ))}
            <path d="M 115 160 L 135 160 L 135 170" stroke={accent} fill="none" strokeWidth={sw} />
            <path d="M 285 160 L 265 160 L 265 170" stroke={accent} fill="none" strokeWidth={sw} />
            <line x1="100" y1="160" x2="300" y2="160" stroke={strokeBold} strokeWidth={sw * 1.4} />
            <rect x="92" y="156" width="14" height="8" rx="1" stroke={strokeBold} fill={`oklch(0.18 0.02 ${hue})`} strokeWidth={sw} />
            <rect x="294" y="156" width="14" height="8" rx="1" stroke={strokeBold} fill={`oklch(0.18 0.02 ${hue})`} strokeWidth={sw} />
            <circle cx="80" cy="160" r="22" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="320" cy="160" r="22" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="80" cy="160" r="6" fill={stroke} />
            <circle cx="320" cy="160" r="6" fill={stroke} />
          </g>
        );
      case 'rower':
        return (
          <g>
            <line x1="60" y1="190" x2="340" y2="190" stroke={strokeBold} strokeWidth={sw * 1.4} />
            <line x1="60" y1="200" x2="340" y2="200" stroke={stroke} strokeWidth={sw * 0.6} />
            <circle cx="90" cy="170" r="42" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <circle cx="90" cy="170" r="30" stroke={stroke} fill="none" strokeWidth={sw * 0.6} />
            <circle cx="90" cy="170" r="6" fill={accent} />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return <line key={i} x1={90 + Math.cos(a) * 8} y1={170 + Math.sin(a) * 8} x2={90 + Math.cos(a) * 28} y2={170 + Math.sin(a) * 28} stroke={stroke} strokeWidth={sw * 0.5} />;
            })}
            <rect x="200" y="180" width="38" height="14" rx="3" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <line x1="130" y1="180" x2="190" y2="180" stroke={accent} strokeWidth={sw * 0.8} />
            <rect x="180" y="170" width="16" height="20" rx="2" stroke={stroke} fill="none" strokeWidth={sw} />
            <rect x="130" y="155" width="22" height="38" rx="2" stroke={stroke} fill="none" strokeWidth={sw} />
            <rect x="130" y="170" width="22" height="6" rx="1" fill={accent} fillOpacity="0.4" />
            <rect x="50" y="125" width="38" height="22" rx="3" stroke={stroke} fill="none" strokeWidth={sw} />
          </g>
        );
      case 'smith':
        return (
          <g>
            <line x1="110" y1="60" x2="130" y2="280" stroke={strokeBold} strokeWidth={sw} />
            <line x1="290" y1="60" x2="270" y2="280" stroke={strokeBold} strokeWidth={sw} />
            <line x1="110" y1="60" x2="290" y2="60" stroke={stroke} strokeWidth={sw} />
            <line x1="80" y1="280" x2="320" y2="280" stroke={stroke} strokeWidth={sw} />
            <line x1="100" y1="170" x2="300" y2="170" stroke={accent} strokeWidth={sw * 1.4} />
            <rect x="90" y="166" width="14" height="8" rx="1" fill={accent} stroke={strokeBold} strokeWidth={sw * 0.6} />
            <rect x="296" y="166" width="14" height="8" rx="1" fill={accent} stroke={strokeBold} strokeWidth={sw * 0.6} />
            <circle cx="115" cy="80" r="5" stroke={stroke} fill="none" strokeWidth={sw * 0.6} />
            <circle cx="285" cy="80" r="5" stroke={stroke} fill="none" strokeWidth={sw * 0.6} />
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`l${i}`} x1={114 + i * 0.7} y1={100 + i * 28} x2={124 + i * 0.7} y2={100 + i * 28} stroke={stroke} strokeWidth={sw * 0.6} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`r${i}`} x1={286 - i * 0.7} y1={100 + i * 28} x2={276 - i * 0.7} y2={100 + i * 28} stroke={stroke} strokeWidth={sw * 0.6} />
            ))}
            <circle cx="76" cy="170" r="18" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="324" cy="170" r="18" stroke={stroke} fill="none" strokeWidth={sw} />
          </g>
        );
      case 'glute-drive':
        return (
          <g>
            <line x1="50" y1="270" x2="350" y2="270" stroke={stroke} strokeWidth={sw} />
            <rect x="60" y="220" width="100" height="50" rx="4" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <line x1="70" y1="232" x2="150" y2="232" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="70" y1="244" x2="150" y2="244" stroke={stroke} strokeWidth={sw * 0.5} />
            <line x1="70" y1="256" x2="150" y2="256" stroke={stroke} strokeWidth={sw * 0.5} />
            <rect x="180" y="180" width="100" height="34" rx="14" stroke={strokeBold} fill={`oklch(0.18 0.02 ${hue})`} strokeWidth={sw} />
            <line x1="220" y1="220" x2="220" y2="280" stroke={stroke} strokeWidth={sw} />
            <line x1="240" y1="220" x2="240" y2="280" stroke={stroke} strokeWidth={sw} />
            <line x1="160" y1="197" x2="300" y2="197" stroke={accent} strokeWidth={sw * 1.2} />
            <circle cx="158" cy="197" r="14" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="302" cy="197" r="14" stroke={stroke} fill="none" strokeWidth={sw} />
            <rect x="310" y="170" width="30" height="40" rx="5" stroke={stroke} fill="none" strokeWidth={sw} />
          </g>
        );
      case 'bike':
        return (
          <g>
            <line x1="160" y1="100" x2="220" y2="220" stroke={strokeBold} strokeWidth={sw} />
            <line x1="160" y1="100" x2="100" y2="220" stroke={strokeBold} strokeWidth={sw} />
            <line x1="100" y1="220" x2="220" y2="220" stroke={stroke} strokeWidth={sw * 0.8} />
            <line x1="220" y1="220" x2="240" y2="130" stroke={strokeBold} strokeWidth={sw} />
            <ellipse cx="240" cy="120" rx="22" ry="8" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <line x1="160" y1="100" x2="155" y2="60" stroke={strokeBold} strokeWidth={sw} />
            <line x1="135" y1="60" x2="175" y2="60" stroke={strokeBold} strokeWidth={sw} />
            <rect x="142" y="38" width="26" height="20" rx="3" stroke={stroke} fill="none" strokeWidth={sw} />
            <circle cx="100" cy="220" r="42" stroke={strokeBold} fill="none" strokeWidth={sw} />
            <circle cx="100" cy="220" r="32" stroke={stroke} fill="none" strokeWidth={sw * 0.5} />
            <circle cx="100" cy="220" r="6" fill={accent} />
            {Array.from({ length: 6 }).map((_, i) => {
              const a = (i / 6) * Math.PI * 2;
              return <line key={i} x1={100 + Math.cos(a) * 8} y1={220 + Math.sin(a) * 8} x2={100 + Math.cos(a) * 30} y2={220 + Math.sin(a) * 30} stroke={stroke} strokeWidth={sw * 0.5} />;
            })}
            <line x1="60" y1="265" x2="290" y2="265" stroke={stroke} strokeWidth={sw} />
            <line x1="100" y1="220" x2="140" y2="244" stroke={accent} strokeWidth={sw} />
            <rect x="134" y="244" width="14" height="6" rx="1" fill={accent} />
          </g>
        );
      default:
        return null;
    }
  })();

  return (
    <svg
      viewBox="0 0 400 340"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className="silhouette"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      {bg}
      <rect width="400" height="340" fill={`url(#g-${id})`} />
      <rect width="400" height="340" fill={`url(#stripes-${id})`} />
      <ellipse cx="160" cy="120" rx="220" ry="120" fill={`url(#spot-${id})`} />
      {sil}
      <text x="20" y="324" fill="rgba(245,241,232,0.32)" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1">
        [ silhouette · {kind} ]
      </text>
      {label && (
        <text x="380" y="324" textAnchor="end" fill="rgba(245,241,232,0.32)" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1">
          {label}
        </text>
      )}
    </svg>
  );
}
