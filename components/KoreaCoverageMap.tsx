type CoveragePoint = {
  city: string;
  note: string;
};

type MapAnchor = {
  x: number;
  y: number;
};

const HUB: MapAnchor = { x: 184, y: 118 };

const CITY_ANCHORS: Record<string, MapAnchor> = {
  수도권: { x: 178, y: 98 },
  충청권: { x: 160, y: 146 },
  영남권: { x: 218, y: 212 },
  호남권: { x: 128, y: 208 },
  강원권: { x: 230, y: 78 },
  제주권: { x: 116, y: 304 }
};

const FALLBACK_ANCHORS: MapAnchor[] = [
  { x: 178, y: 98 },
  { x: 160, y: 146 },
  { x: 218, y: 212 },
  { x: 128, y: 208 },
  { x: 230, y: 78 },
  { x: 116, y: 304 }
];

function anchorFor(point: CoveragePoint, index: number) {
  return CITY_ANCHORS[point.city] ?? FALLBACK_ANCHORS[index % FALLBACK_ANCHORS.length];
}

function routePath(anchor: MapAnchor, index: number) {
  const direction = index % 2 === 0 ? 1 : -1;
  const curveX = (HUB.x + anchor.x) / 2 + direction * 16;
  const curveY = (HUB.y + anchor.y) / 2 - 24;

  return `M ${HUB.x} ${HUB.y} Q ${curveX} ${curveY} ${anchor.x} ${anchor.y}`;
}

export default function KoreaCoverageMap({ points }: { points: CoveragePoint[] }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-black/10 bg-[linear-gradient(160deg,rgba(33,193,162,0.14),rgba(255,255,255,0.98)_54%)] p-6 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(11,15,14,0.05)_1px,transparent_1px),linear-gradient(rgba(11,15,14,0.05)_1px,transparent_1px)] bg-[size:38px_38px] opacity-35" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 korea-map-sweep" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(33,193,162,0.2),transparent_42%),radial-gradient(circle_at_8%_84%,rgba(11,15,14,0.06),transparent_52%)]" />

      <div className="relative overflow-hidden rounded-[24px] border border-black/10 bg-white/94 p-5 md:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-5">
          <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-semibold tracking-[0.06em] text-black/62">
            SEO/운영 허브
          </span>
          <span className="inline-flex items-center rounded-full border border-[#21c1a2]/30 bg-[#21c1a2]/10 px-3 py-1 text-xs font-semibold tracking-[0.06em] text-[#138e77]">
            전국 단위 확장
          </span>
        </div>

        <svg
          viewBox="0 0 360 340"
          role="img"
          aria-label="한반도 전역으로 확장되는 운영 커버리지"
          className="h-auto w-full"
        >
          <defs>
            <linearGradient id="korea-map-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7f9f9" />
              <stop offset="100%" stopColor="#e9f8f5" />
            </linearGradient>
            <linearGradient id="korea-route-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(11,15,14,0.3)" />
              <stop offset="55%" stopColor="rgba(33,193,162,0.92)" />
              <stop offset="100%" stopColor="rgba(33,193,162,0.98)" />
            </linearGradient>
            <filter id="korea-map-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0b0f0e" floodOpacity="0.12" />
            </filter>
            <filter id="korea-route-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M176 24L192 40L218 34L236 42L248 58L250 74L266 90L260 108L270 126L260 144L270 160L260 180L244 194L232 214L236 232L224 246L208 250L198 266L180 282L176 304L156 306L148 286L132 274L126 254L106 238L98 220L102 204L92 186L80 170L86 150L78 132L88 112L102 98L114 80L128 70L138 52L152 42L164 30Z"
            fill="url(#korea-map-gradient)"
            stroke="rgba(11,15,14,0.2)"
            strokeWidth="2"
            filter="url(#korea-map-shadow)"
          />

          <path
            d="M96 302L116 296L126 304L120 318L102 322L90 314Z"
            fill="url(#korea-map-gradient)"
            stroke="rgba(11,15,14,0.2)"
            strokeWidth="1.4"
          />

          {points.map((point, index) => {
            const anchor = anchorFor(point, index);
            const delay = `${index * 0.14}s`;
            const path = routePath(anchor, index);

            return (
              <g key={`${point.city}-${index}`}>
                <path d={path} fill="none" stroke="none" />
                <line
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={anchor.x}
                  y2={anchor.y}
                  stroke="rgba(11,15,14,0.08)"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />
                <path
                  d={path}
                  className="korea-route"
                  stroke="url(#korea-route-gradient)"
                  fill="none"
                  filter="url(#korea-route-glow)"
                  style={{ animationDelay: delay }}
                />
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r="4"
                  className="korea-route-dot"
                  style={{ animationDelay: delay }}
                />
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r="4"
                  className="korea-route-pulse"
                  style={{ animationDelay: delay }}
                />
                <text
                  x={anchor.x + 8}
                  y={anchor.y - 8}
                  className="korea-city-label"
                  style={{ animationDelay: delay }}
                >
                  {point.city}
                </text>
                <circle r="3.2" className="korea-route-travel" style={{ animationDelay: delay }}>
                  <animateMotion dur="2.8s" begin={delay} repeatCount="indefinite" path={path} />
                </circle>
              </g>
            );
          })}

          <circle cx={HUB.x} cy={HUB.y} r="17" className="korea-hub-ring" />
          <circle cx={HUB.x} cy={HUB.y} r="17" className="korea-hub-ring korea-hub-ring--delay" />
          <circle cx={HUB.x} cy={HUB.y} r="6" className="korea-route-dot korea-route-dot--hub" />
          <circle cx={HUB.x} cy={HUB.y} r="6" className="korea-route-pulse korea-route-pulse--hub" />
          <text x={HUB.x + 10} y={HUB.y + 20} className="korea-city-label">
            서울 허브
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 md:mt-5">
        {points.map((point) => (
          <span
            key={`chip-${point.city}`}
            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold leading-none text-black/70 shadow-[0_4px_10px_rgba(11,15,14,0.03)]"
          >
            {point.city}
          </span>
        ))}
      </div>
    </div>
  );
}
