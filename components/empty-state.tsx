import Link from "next/link";
import { CategoryType } from "@/lib/types";

export function EmptyState({
  title,
  description,
  category: _category,
  showBackLink = false,
}: {
  title: string;
  description: string;
  category?: CategoryType;
  showBackLink?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-[14px] text-center"
      style={{
        padding: "120px 40px",
        minHeight: 480,
      }}
    >
      <div
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 84,
          fontVariationSettings: '"opsz" 144, "SOFT" 100',
          color: "var(--ink-4)",
          letterSpacing: "-0.04em",
          lineHeight: 0.9,
          textWrap: "balance",
        }}
      >
        {title.split(" ").length >= 3 ? (
          <SplitTitle title={title} />
        ) : (
          <em style={{ color: "var(--accent)" }}>{title}</em>
        )}
      </div>

      <p
        style={{
          marginTop: 14,
          fontSize: 13,
          lineHeight: 1.55,
          color: "var(--ink-3)",
          maxWidth: 420,
        }}
      >
        {description}
      </p>

      {showBackLink && (
        <Link
          href="/"
          className="btn primary"
          style={{ marginTop: 8, textDecoration: "none" }}
        >
          ← Back to today&apos;s feed
        </Link>
      )}
    </div>
  );
}

function SplitTitle({ title }: { title: string }) {
  // Italicize the last 1-2 words for the editorial feel.
  const words = title.split(" ");
  const accentCount = Math.min(2, Math.max(1, Math.floor(words.length / 2)));
  const lead = words.slice(0, words.length - accentCount).join(" ");
  const tail = words.slice(words.length - accentCount).join(" ");
  return (
    <>
      {lead}
      <br />
      <em style={{ color: "var(--accent)" }}>{tail}</em>
    </>
  );
}
