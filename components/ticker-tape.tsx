"use client";

import { Article } from "@/lib/types";
import { openUrl } from "@/lib/open-url";

export function TickerTape({ articles }: { articles: Article[] }) {
  // Take the first 16 by recency for the wire — the source-sorted feed already
  // arrives newest-first, so this is "what's hitting the wire right now".
  const wire = articles.slice(0, 16);
  if (wire.length === 0) return null;

  // Duplicate the track for a seamless loop.
  const items = [...wire, ...wire];

  return (
    <div
      className="relative flex items-center overflow-hidden"
      style={{
        height: 30,
        background: "var(--bg-2)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      {/* Edge fades */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[80px]"
        style={{
          background: "linear-gradient(to right, var(--bg-2), transparent)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-[80px]"
        style={{
          background: "linear-gradient(to left, var(--bg-2), transparent)",
        }}
      />

      {/* ON THE WIRE tag */}
      <div
        className="relative z-[3] flex h-full shrink-0 items-center"
        style={{
          background: "var(--accent)",
          color: "white",
          fontFamily: "var(--mono)",
          fontSize: 9.5,
          letterSpacing: "0.16em",
          padding: "7px 12px",
          textTransform: "uppercase",
        }}
      >
        <span
          className="dot-live"
          style={{ background: "white", marginRight: 8 }}
        />
        ▲ On the Wire
      </div>

      {/* Track */}
      <div
        className="flex shrink-0 whitespace-nowrap"
        style={{
          animation: "tickerScroll 90s linear infinite",
        }}
      >
        {items.map((a, i) => (
          <button
            key={`${a.id}-${i}`}
            onClick={() => openUrl(a.url)}
            className="hover-accent inline-flex shrink-0 items-center gap-[8px]"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--ink-2)",
              letterSpacing: "0.04em",
              padding: "0 22px",
              borderRight: "1px solid var(--rule-soft)",
              background: "transparent",
              border: "none",
              borderRightStyle: "solid",
              borderRightWidth: 1,
              borderRightColor: "var(--rule-soft)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {a.source}
            </span>
            <span style={{ maxWidth: "60ch" }} className="truncate">
              {a.title}
            </span>
            {typeof a.points === "number" && a.points > 0 ? (
              <span style={{ color: "var(--ok)" }}>↗ {a.points}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
