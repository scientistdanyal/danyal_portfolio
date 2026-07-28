"use client";

export function Plate({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-widest text-[var(--blueprint-line)]">
        {label}
      </p>
      <div className="mt-2 h-px w-full bg-[var(--blueprint-line)]/40" />
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-wide text-[var(--blueprint-line)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded border border-[var(--blueprint-line)]/30 bg-[var(--blueprint-navy)] px-3 py-2 text-sm text-[var(--paper)] outline-none focus:border-[var(--signal-amber)] focus:ring-2 focus:ring-[var(--signal-amber)]/40";

export const buttonClass =
  "rounded bg-[var(--signal-amber)] px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs font-medium text-[var(--ink)] transition hover:brightness-110 disabled:opacity-50";

export const ghostButtonClass =
  "rounded border border-[var(--blueprint-line)]/40 px-3 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[var(--blueprint-line)] hover:border-[var(--signal-amber)] hover:text-[var(--signal-amber)]";

export function PaperCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded bg-[var(--paper)] p-4 text-[var(--ink)] shadow-sm">
      {children}
    </div>
  );
}
