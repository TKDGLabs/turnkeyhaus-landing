import type { SignalInsightItem } from "../content";

type SignalInsightsProps = {
  label: string;
  title: string;
  lead: string;
  items: SignalInsightItem[];
};

function DependencyGraphic() {
  return (
    <svg
      viewBox="0 0 148 108"
      aria-hidden="true"
      className="h-full w-full"
      fill="none"
    >
      <path d="M18 20.5H130" className="signal-gridline" />
      <path d="M18 54H130" className="signal-gridline" />
      <path d="M18 87.5H130" className="signal-gridline" />
      <path d="M20 85L48 70L76 58L104 44L128 31" className="signal-line signal-line--accent" />
      <path d="M20 34L48 44L76 58L104 72L128 82" className="signal-line signal-line--muted" />
      <circle cx="128" cy="31" r="5" className="signal-dot" />
      <circle cx="128" cy="82" r="4.5" className="signal-dot signal-dot--muted" />
      <path
        d="M20 89C35 76 53 70 76 64C92 60 108 51 128 36"
        className="signal-wash signal-wash--accent"
      />
      <path
        d="M20 33C38 41 57 47 76 56C92 64 109 74 128 84"
        className="signal-wash signal-wash--muted"
      />
    </svg>
  );
}

function CtrGraphic() {
  return (
    <svg
      viewBox="0 0 148 108"
      aria-hidden="true"
      className="h-full w-full"
      fill="none"
    >
      <rect x="17" y="15" width="114" height="78" rx="18" className="signal-frame" />
      <rect x="33" y="62" width="16" height="22" rx="8" className="signal-bar signal-bar--delay-1" />
      <rect x="56" y="48" width="16" height="36" rx="8" className="signal-bar signal-bar--delay-2" />
      <rect x="79" y="34" width="16" height="50" rx="8" className="signal-bar signal-bar--delay-3" />
      <rect x="102" y="21" width="16" height="63" rx="8" className="signal-bar signal-bar--delay-4" />
      <path d="M31 30H69" className="signal-gate" />
      <circle cx="69" cy="30" r="5" className="signal-dot" />
      <circle cx="69" cy="30" r="10" className="signal-node-ring" />
      <path d="M69 30H116" className="signal-line signal-line--accent signal-line--short" />
    </svg>
  );
}

function SetupGraphic() {
  return (
    <svg
      viewBox="0 0 148 108"
      aria-hidden="true"
      className="h-full w-full"
      fill="none"
    >
      <path d="M32 33H116" className="signal-gridline" />
      <path d="M32 73H116" className="signal-gridline" />
      <path d="M32 53H116" className="signal-line signal-line--muted signal-line--short" />
      <circle cx="32" cy="53" r="7" className="signal-node" />
      <circle cx="74" cy="53" r="7" className="signal-node signal-node--accent" />
      <circle cx="116" cy="53" r="7" className="signal-node" />
      <circle cx="74" cy="53" r="15" className="signal-node-ring" />
      <g className="signal-travel">
        <circle cx="32" cy="53" r="4.5" className="signal-dot" />
      </g>
    </svg>
  );
}

function SignalGraphic({ variant }: { variant: SignalInsightItem["variant"] }) {
  if (variant === "dependency") return <DependencyGraphic />;
  if (variant === "ctr") return <CtrGraphic />;
  return <SetupGraphic />;
}

export default function SignalInsights({
  label,
  title,
  lead,
  items
}: SignalInsightsProps) {
  const [leadBody, leadEmphasis] = lead.split("\n\n");

  return (
    <div className="signal-board overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_16px_44px_rgba(11,15,14,0.06)]">
      <div className="space-y-5 px-6 py-6 md:px-8 md:py-8">
        <div className="text-sm font-semibold tracking-[0.12em] text-black/45 md:text-base">
          {label}
        </div>
        <div className="grid gap-4 md:grid-cols-[0.92fr_1.08fr] md:items-end">
          <h3 className="max-w-[15ch] whitespace-pre-line break-keep text-[32px] font-semibold leading-[1.24] tracking-tight text-[#0B0F0E] md:text-[46px] md:leading-[1.18] lg:text-[52px]">
            {title}
          </h3>
          <div className="space-y-3 md:justify-self-end">
            <p className="max-w-[48ch] whitespace-pre-line break-keep text-base leading-[1.95] text-black/68 md:text-lg">
              {leadBody}
            </p>
            {leadEmphasis ? (
              <p className="max-w-[48ch] whitespace-pre-line break-keep text-base font-semibold leading-[1.85] text-black/82 md:text-lg">
                {leadEmphasis}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-px border-t border-black/10 bg-black/10 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="flex h-full flex-col bg-white p-6 md:p-7"
          >
            <div className="mb-6 rounded-[24px] border border-black/10 bg-black/[0.02] p-4 md:p-5">
              <div className="h-44 md:h-52 lg:h-56">
                <SignalGraphic variant={item.variant} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm font-semibold tracking-[0.12em] text-[#21c1a2]">
                {item.eyebrow}
              </div>
              <h4 className="text-[22px] font-semibold leading-[1.4] tracking-tight text-[#0B0F0E] md:text-[24px]">
                {item.title}
              </h4>
              <p className="whitespace-pre-line break-keep text-base leading-[1.9] text-black/72">
                {item.summary}
              </p>
              <p className="text-sm leading-[1.85] text-black/52">{item.note}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
