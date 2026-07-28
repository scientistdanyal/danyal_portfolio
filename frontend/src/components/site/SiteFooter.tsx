import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--blueprint-line)]/20">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="mono text-[10px] tracking-wider text-[var(--blueprint-line)]">
          ENGINEERDANYAL.COM · BLUEPRINT REV. 01
        </p>
        <div className="flex gap-4">
          <Link
            href="/contact"
            className="mono text-[10px] tracking-wider text-[var(--paper)]/70 hover:text-[var(--signal-amber)]"
          >
            CONTACT
          </Link>
          <Link
            href="/projects"
            className="mono text-[10px] tracking-wider text-[var(--paper)]/70 hover:text-[var(--signal-amber)]"
          >
            WORK
          </Link>
        </div>
      </div>
    </footer>
  );
}
