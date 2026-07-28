export function Plate({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <p className="mono text-[10px] tracking-[0.2em] text-[var(--blueprint-line)] md:text-xs">
        {label}
      </p>
      <div className="mt-3 h-px w-full bg-[var(--blueprint-line)]/40" />
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}
