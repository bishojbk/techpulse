"use client";

import { Article } from "@/lib/types";
import { openUrl } from "@/lib/open-url";

const ROMAN = ["i", "ii", "iii", "iv", "v"];

export function AsideRail({ articles }: { articles: Article[] }) {
  // Trending: top 5 by HN points + comments — same metric the home page uses.
  const trending = [...articles]
    .sort(
      (a, b) =>
        (b.commentCount ?? 0) +
        (b.points ?? 0) -
        ((a.commentCount ?? 0) + (a.points ?? 0)),
    )
    .slice(0, 5);

  // Source breakdown
  const sourceCounts = new Map<string, number>();
  for (const a of articles) {
    sourceCounts.set(a.source, (sourceCounts.get(a.source) ?? 0) + 1);
  }
  const sources = Array.from(sourceCounts.entries()).sort(
    ([, a], [, b]) => b - a,
  );

  // 24h activity sparkline — bucket articles by hour
  const buckets = build24hBuckets(articles);

  return (
    <aside
      className="min-w-0 border-t px-6 pb-20 pt-8 md:px-8 xl:border-t-0 xl:border-l xl:[padding-left:28px]"
      style={{ borderColor: "var(--rule-soft)" }}
    >
      {/* Trending — the deck */}
      <div className="mb-[32px]">
        <RailHead live>Trending — the deck</RailHead>
        <div className="relative pt-[20px]">
          {trending.map((a, i) => (
            <DeckCard key={a.id} article={a} idx={i} />
          ))}
        </div>
      </div>

      {/* Source diversity */}
      {sources.length > 0 && (
        <div className="mb-[32px]">
          <RailHead right={`${sources.length} active`}>
            Source diversity
          </RailHead>
          <SourceDiversityBar
            sources={sources}
            total={articles.length}
          />
        </div>
      )}

      {/* 24h wire activity sparkline */}
      <div className="mb-[32px]">
        <RailHead right="last 24h">Wire activity</RailHead>
        <Sparkline buckets={buckets} />
      </div>

      {/* Sources today */}
      <div className="mb-[32px]">
        <RailHead right="today">Sources on the wire</RailHead>
        {sources.slice(0, 8).map(([src, n]) => (
          <div
            key={src}
            className="flex items-center justify-between"
            style={{
              padding: "9px 0",
              borderBottom: "1px solid var(--rule-soft)",
              fontSize: 12.5,
            }}
          >
            <span style={{ color: "var(--ink)" }} className="flex items-center gap-2">
              <span className="fav">{src.charAt(0).toUpperCase()}</span>
              {src}
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10.5,
                color: "var(--ink-3)",
              }}
            >
              {n}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function RailHead({
  children,
  right,
  live,
}: {
  children: React.ReactNode;
  right?: string;
  live?: boolean;
}) {
  return (
    <div
      className="mb-[12px] flex justify-between pb-[10px]"
      style={{
        fontFamily: "var(--mono)",
        fontSize: 9.5,
        color: "var(--ink-4)",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <span>{children}</span>
      {live ? (
        <span
          className="inline-flex items-center gap-[5px]"
          style={{ color: "var(--accent)" }}
        >
          <span
            className="dot-live"
            style={{ marginRight: 0, width: 5, height: 5 }}
          />
          live
        </span>
      ) : right ? (
        <span>{right}</span>
      ) : null}
    </div>
  );
}

function DeckCard({ article, idx }: { article: Article; idx: number }) {
  const score = (article.points ?? 0) + (article.commentCount ?? 0);
  const rotations = ["-0.6deg", "0.4deg", "-0.3deg", "0.5deg", "-0.2deg"];
  const offsets = [
    { ml: 6, mr: -2 },
    { ml: 0, mr: 0 },
    { ml: -3, mr: 0 },
    { ml: 0, mr: 4 },
    { ml: 0, mr: 0 },
  ];
  const o = offsets[idx % offsets.length];

  return (
    <button
      onClick={() => openUrl(article.url)}
      className="hover-accent group block w-full cursor-pointer text-left"
      style={{
        position: "relative",
        background: "var(--paper)",
        border: "1px solid var(--rule)",
        padding: "14px 16px",
        marginBottom: 10,
        marginLeft: o.ml,
        marginRight: o.mr,
        display: "grid",
        gridTemplateColumns: "24px 1fr auto",
        gap: 12,
        alignItems: "baseline",
        transform: `rotate(${rotations[idx % rotations.length]})`,
        transition: "transform 180ms ease, border-color 180ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0) translateY(-2px)";
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.zIndex = "2";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotations[idx % rotations.length]})`;
        e.currentTarget.style.borderColor = "var(--rule)";
        e.currentTarget.style.zIndex = "0";
      }}
    >
      <span
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontVariationSettings: '"opsz" 60',
          fontSize: 24,
          color: "var(--accent)",
          lineHeight: 1,
        }}
      >
        {ROMAN[idx] ?? idx + 1}
      </span>
      <div className="min-w-0">
        <div
          className="line-clamp-2"
          style={{
            fontFamily: "var(--serif)",
            fontSize: 14,
            lineHeight: 1.3,
            color: "var(--ink)",
            fontVariationSettings: '"opsz" 18',
          }}
        >
          {article.title}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 9.5,
            color: "var(--ink-3)",
            marginTop: 4,
            letterSpacing: "0.04em",
          }}
        >
          {article.source}
          {score > 0 && ` · ${score.toLocaleString()} pts`}
        </div>
      </div>
      {score > 0 && (
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--accent)",
            whiteSpace: "nowrap",
          }}
        >
          ▲ {score >= 1000 ? `${(score / 1000).toFixed(1)}k` : score}
        </span>
      )}
    </button>
  );
}

const DIVERSITY_COLORS = [
  "var(--accent)",
  "oklch(0.62 0.09 80)",
  "oklch(0.55 0.08 200)",
  "oklch(0.58 0.10 150)",
  "oklch(0.50 0.06 280)",
  "var(--ink-3)",
  "var(--ink-4)",
];

function SourceDiversityBar({
  sources,
  total,
}: {
  sources: [string, number][];
  total: number;
}) {
  const top = sources.slice(0, 7);
  const rest = sources.slice(7).reduce((s, [, n]) => s + n, 0);
  const all: [string, number][] =
    rest > 0 ? [...top, ["Other", rest] as [string, number]] : top;

  return (
    <div className="flex flex-col gap-[8px]">
      <div
        className="flex"
        style={{
          height: 10,
          border: "1px solid var(--rule)",
        }}
      >
        {all.map(([src, n], i) => (
          <div
            key={src}
            style={{
              background: DIVERSITY_COLORS[i % DIVERSITY_COLORS.length],
              width: `${(n / total) * 100}%`,
              borderRight:
                i === all.length - 1 ? "none" : "1px solid var(--rule)",
            }}
          />
        ))}
      </div>
      <div
        className="flex flex-wrap gap-x-[14px] gap-y-[4px]"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--ink-3)",
        }}
      >
        {all.map(([src, n], i) => (
          <span key={src} className="inline-flex items-center gap-[5px]">
            <span
              style={{
                width: 8,
                height: 8,
                background: DIVERSITY_COLORS[i % DIVERSITY_COLORS.length],
                display: "inline-block",
              }}
            />
            {src} {Math.round((n / total) * 100)}%
          </span>
        ))}
      </div>
    </div>
  );
}

function build24hBuckets(articles: Article[]): number[] {
  const now = Date.now();
  const buckets = new Array(24).fill(0);
  for (const a of articles) {
    const ms = now - new Date(a.publishedAt).getTime();
    if (ms < 0 || ms > 24 * 60 * 60 * 1000) continue;
    const hoursAgo = Math.floor(ms / (60 * 60 * 1000));
    const idx = 23 - hoursAgo; // newest on the right
    if (idx >= 0 && idx < 24) buckets[idx]++;
  }
  return buckets;
}

function Sparkline({ buckets }: { buckets: number[] }) {
  const width = 280;
  const height = 38;
  const max = Math.max(1, ...buckets);
  const step = width / (buckets.length - 1);

  const points = buckets.map((v, i) => {
    const x = i * step;
    const y = height - (v / max) * (height - 4) - 2;
    return [x, y] as const;
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
    .join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  const last = points[points.length - 1];
  const total = buckets.reduce((s, v) => s + v, 0);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: 38 }}
      >
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="var(--rule-soft)"
          strokeWidth={0.5}
        />
        <path d={areaPath} fill="var(--accent)" opacity={0.1} />
        <path
          d={linePath}
          stroke="var(--accent)"
          strokeWidth={1.4}
          fill="none"
        />
        <circle cx={last[0]} cy={last[1]} r={3} fill="var(--accent)" />
      </svg>
      <div
        className="mt-[6px] flex items-baseline justify-between"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9.5,
          color: "var(--ink-3)",
          letterSpacing: "0.06em",
        }}
      >
        <span>24h</span>
        <span style={{ color: "var(--accent)" }}>{total} stories</span>
      </div>
    </div>
  );
}
