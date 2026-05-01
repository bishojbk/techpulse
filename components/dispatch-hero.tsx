"use client";

import { useEffect, useState } from "react";
import { useArticlesContext } from "@/hooks/articles-context";
import { CATEGORIES } from "@/lib/types";

const ORDINAL_SUFFIX = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] ?? s[v] ?? s[0];
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const numberWords = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
function yearWord(n: number): string {
  // Last two digits — Twenty-Six for 2026, etc.
  const y = n % 100;
  if (y < 20) return numberWords[y];
  return `${tens[Math.floor(y / 10)]}${y % 10 ? `-${numberWords[y % 10]}` : ""}`;
}

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = +d - +start;
  return Math.floor(diff / 86_400_000);
}

export function DispatchHero() {
  const { articles } = useArticlesContext();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!now) return <DispatchHeroSkeleton />;

  // — Real metrics from real data —
  const stories = articles.length;
  const sources = new Set(articles.map((a) => a.source)).size;
  const sectionsCovered = new Set(articles.map((a) => a.category)).size;
  const last24h = articles.filter(
    (a) =>
      now.getTime() - new Date(a.publishedAt).getTime() < 24 * 60 * 60 * 1000,
  ).length;

  // Latest publish time → "Curated"
  const latest = articles[0]
    ? new Date(articles[0].publishedAt)
    : now;
  const curatedAgoMin = Math.max(
    0,
    Math.round((now.getTime() - latest.getTime()) / 60_000),
  );

  // Top section + top source — for the "facts" table
  const sectionTally = new Map<string, number>();
  const sourceTally = new Map<string, number>();
  for (const a of articles) {
    sectionTally.set(a.category, (sectionTally.get(a.category) ?? 0) + 1);
    sourceTally.set(a.source, (sourceTally.get(a.source) ?? 0) + 1);
  }
  const topSection =
    Array.from(sectionTally.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] ??
    "—";
  const topSource =
    Array.from(sourceTally.entries()).sort(([, a], [, b]) => b - a)[0]?.[0] ??
    "—";
  const topSectionLabel =
    CATEGORIES.find((c) => c.slug === topSection)?.label ?? topSection;

  // "Conditions" — narrative based on hourly rate
  const hourly = stories / 24;
  const conditions =
    hourly > 4
      ? "Brisk, shipping"
      : hourly > 2
        ? "Steady, on the wire"
        : hourly > 0.5
          ? "Quiet, signal-only"
          : "Hush";

  const day = DAYS[now.getDay()];
  const month = MONTHS[now.getMonth()];
  const date = now.getDate();
  const ord = ORDINAL_SUFFIX(date);
  const dateOrdinal = numberWords[date] ?? `${date}`;
  // Match the prototype's "First/Twelfth/etc." aesthetic when possible.
  const ordinalWord = (() => {
    if (date === 1) return "First";
    if (date === 2) return "Second";
    if (date === 3) return "Third";
    if (date === 21) return "Twenty-First";
    if (date === 22) return "Twenty-Second";
    if (date === 23) return "Twenty-Third";
    if (date === 31) return "Thirty-First";
    if (date <= 19) return `${dateOrdinal}${ord !== "th" ? "th" : ""}`.replace(/\.$/, "");
    return `${dateOrdinal}`;
  })();
  // Always supply numeric+ordinal as the visible glyph, matching the prototype precisely.

  const yearSuffix = yearWord(now.getFullYear());
  const edition = String(dayOfYear(now)).padStart(3, "0");
  const isoStamp = `${day.slice(0, 3).toUpperCase()} · ${date.toString().padStart(2, "0")} ${month.slice(0, 3).toUpperCase()} ${now.getFullYear() % 100}`;
  const curatedClock = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        borderColor: "var(--rule)",
        padding: "32px 40px 0",
        background: `
          radial-gradient(ellipse at 100% 0%, oklch(0.32 0.10 30 / 0.55), transparent 50%),
          radial-gradient(ellipse at 0% 100%, oklch(0.26 0.05 60 / 0.45), transparent 55%),
          var(--bg)
        `,
      }}
    >
      {/* Ghost numeral */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: "-0.06em",
          bottom: "-0.24em",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontVariationSettings: '"opsz" 144, "SOFT" 100',
          fontWeight: 400,
          fontSize: "clamp(180px, 22vw, 360px)",
          lineHeight: 0.78,
          letterSpacing: "-0.06em",
          color: "transparent",
          WebkitTextStroke: "1px var(--rule)",
          pointerEvents: "none",
          userSelect: "none",
          opacity: 0.35,
          zIndex: 0,
        }}
      >
        {edition}
      </span>

      <div className="relative z-10">
        {/* TOP BAR */}
        <div
          className="flex items-center justify-between pb-[14px]"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            color: "var(--ink-3)",
            textTransform: "uppercase",
            borderBottom: "1px solid var(--rule-soft)",
          }}
        >
          <div className="flex flex-wrap gap-[18px]">
            <span style={{ color: "var(--ink)" }}>
              <span className="dot-live" /> Edition № {edition} · Live
            </span>
            <span>Vol. I · Year 01</span>
            <span>Curated {curatedClock}</span>
          </div>
          <div className="hidden items-center gap-[14px] md:flex">
            <span>
              {stories} stor{stories === 1 ? "y" : "ies"} · {sources} sources
            </span>
            <span
              style={{
                border: "1px solid var(--ink-3)",
                color: "var(--ink-2)",
                padding: "4px 10px",
                letterSpacing: "0.18em",
                transform: "rotate(-1.5deg)",
                display: "inline-block",
              }}
            >
              Press · {isoStamp}
            </span>
          </div>
        </div>

        {/* DATE SPREAD */}
        <div className="block pb-[40px]">
          <div
            style={{
              fontFamily: "var(--serif)",
              fontVariationSettings: '"opsz" 144, "SOFT" 30',
              fontWeight: 500,
              fontSize: "clamp(56px, 8vw, 124px)",
              lineHeight: 1,
              letterSpacing: "-0.045em",
              color: "var(--ink)",
              marginBottom: 8,
            }}
          >
            <span>{day},</span>{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                fontVariationSettings: '"opsz" 144, "SOFT" 100',
              }}
            >
              {month}
            </span>
          </div>

          <div
            className="grid items-end gap-[36px] pt-1"
            style={{ gridTemplateColumns: "auto minmax(160px, 1fr) auto" }}
          >
            {/* Ordinal */}
            <div
              style={{
                fontFamily: "var(--serif)",
                fontVariationSettings: '"opsz" 144, "SOFT" 100',
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(72px, 9vw, 148px)",
                lineHeight: 0.88,
                letterSpacing: "-0.055em",
                color: "var(--ink)",
                position: "relative",
                display: "inline-flex",
                alignItems: "baseline",
              }}
            >
              {ordinalWord}
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontStyle: "normal",
                  fontSize: "0.12em",
                  letterSpacing: "0.04em",
                  color: "var(--ink-3)",
                  marginLeft: "0.06em",
                  alignSelf: "flex-start",
                  marginTop: "0.4em",
                }}
              >
                {ord}
              </span>
            </div>

            {/* Facts */}
            <div
              className="grid gap-[14px] self-end"
              style={{
                paddingBottom: 14,
                paddingLeft: 24,
                borderLeft: "1px solid var(--rule)",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--ink-3)",
                textTransform: "uppercase",
              }}
            >
              <FactRow label="Top section" value={topSectionLabel} accent />
              <FactRow label="Top source" value={topSource} />
              <FactRow label="Conditions" value={conditions} italic />
              <FactRow
                label="Curated"
                value={
                  curatedAgoMin === 0
                    ? "just now"
                    : `${curatedAgoMin}m ago`
                }
              />
            </div>

            {/* Year + edition */}
            <div className="grid gap-[6px] self-end pb-[18px] text-right">
              <div
                className="flex flex-col gap-[4px] pb-[14px]"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "var(--ink-3)",
                  borderBottom: "1px solid var(--rule)",
                }}
              >
                <span>Year of</span>
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontStyle: "italic",
                    fontVariationSettings: '"opsz" 60',
                    fontWeight: 400,
                    fontSize: 38,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                  }}
                >
                  {yearSuffix}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--serif)",
                  fontVariationSettings: '"opsz" 144',
                  fontSize: 52,
                  lineHeight: 1,
                  color: "var(--ink)",
                  letterSpacing: "-0.04em",
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontStyle: "normal",
                    fontSize: "0.3em",
                    color: "var(--accent)",
                    verticalAlign: "super",
                    marginRight: "0.05em",
                    letterSpacing: 0,
                  }}
                >
                  №
                </span>
                {edition}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STAT STRIP */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            borderTop: "1px solid var(--rule)",
            margin: "0 -40px",
          }}
        >
          <Stat label="Stories" value={String(stories)} />
          <Stat label="Sources" value={String(sources)} />
          <Stat label="Sections" value={String(sectionsCovered)} />
          <Stat label="Last 24h" value={String(last24h)} accent={last24h > 0} />
          <Stat
            label="Updated"
            value={
              curatedAgoMin === 0
                ? "live"
                : curatedAgoMin < 60
                  ? `${curatedAgoMin}m ago`
                  : "earlier"
            }
            italic
          />
        </div>
      </div>
    </section>
  );
}

function FactRow({
  label,
  value,
  accent,
  italic,
}: {
  label: string;
  value: string;
  accent?: boolean;
  italic?: boolean;
}) {
  return (
    <div
      className="grid items-baseline gap-[8px]"
      style={{ gridTemplateColumns: "auto 1fr auto" }}
    >
      <span style={{ color: "var(--ink-4)" }}>{label}</span>
      <span className="dotline" />
      <span
        style={{
          fontFamily: "var(--serif)",
          fontStyle: italic ? "italic" : undefined,
          fontVariationSettings: '"opsz" 24',
          fontSize: 16,
          color: accent ? "var(--accent)" : "var(--ink)",
          letterSpacing: "-0.01em",
          textTransform: "none",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  italic,
}: {
  label: string;
  value: string;
  accent?: boolean;
  italic?: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-[4px]"
      style={{
        padding: "14px 18px",
        borderRight: "1px solid var(--rule-soft)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ink-4)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--serif)",
          fontVariationSettings: '"opsz" 40',
          fontWeight: italic ? 400 : 500,
          fontStyle: italic ? "italic" : undefined,
          fontSize: 22,
          letterSpacing: "-0.02em",
          color: accent ? "var(--accent)" : "var(--ink)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DispatchHeroSkeleton() {
  return (
    <section
      className="border-b"
      style={{
        borderColor: "var(--rule)",
        padding: "32px 40px 0",
        background: "var(--bg)",
        minHeight: 460,
      }}
    >
      <div className="sk-line s sk-shimmer" style={{ width: "30%" }} />
      <div className="sk-line l sk-shimmer" style={{ marginTop: 28 }} />
      <div className="sk-line m sk-shimmer" />
    </section>
  );
}
