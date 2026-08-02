export function Plate({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
  /** @deprecated use eyebrow instead */
  label?: string;
}) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      {eyebrow ? (
        <p className="mono text-[11px] tracking-[0.15em] uppercase text-[var(--fg-muted)]">
          {"// "}{eyebrow}
        </p>
      ) : null}
      <div className="section-rule-strong mt-4" />
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}
