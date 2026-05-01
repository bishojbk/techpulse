"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="animate-fade-in-up fixed bottom-6 right-6 z-50"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        width: 36,
        height: 36,
        display: "grid",
        placeItems: "center",
        background: "var(--paper)",
        border: "1px solid var(--rule)",
        color: "var(--ink-2)",
        cursor: "pointer",
        transition: "background-color 120ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--paper-2)";
        e.currentTarget.style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--paper)";
        e.currentTarget.style.color = "var(--ink-2)";
      }}
    >
      <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    </button>
  );
}
