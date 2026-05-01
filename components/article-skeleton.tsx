export function ArticleSkeletonGrid() {
  return (
    <div style={{ padding: "32px 40px 80px" }}>
      <div
        className="sk-line s sk-shimmer"
        style={{ width: "30%", marginBottom: 14 }}
      />
      <div className="sk-line l sk-shimmer" />
      <div className="sk-line m sk-shimmer" />
      <div
        className="sk-line s sk-shimmer"
        style={{ width: "50%", marginTop: 28 }}
      />
      <div className="sk-line sk-shimmer" />
      <div className="sk-line sk-shimmer" style={{ width: "90%" }} />
      <div
        className="sk-line s sk-shimmer"
        style={{ width: "30%", marginTop: 24 }}
      />
      <div className="sk-line sk-shimmer" style={{ width: "70%" }} />
      <div className="sk-line sk-shimmer" style={{ width: "80%" }} />
      <div
        className="mt-[24px] flex justify-between border-t pt-[14px]"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--ink-3)",
          letterSpacing: "0.08em",
          borderColor: "var(--rule-soft)",
        }}
      >
        <span>● Assembling the wire</span>
        <span>summarizing…</span>
      </div>
    </div>
  );
}
