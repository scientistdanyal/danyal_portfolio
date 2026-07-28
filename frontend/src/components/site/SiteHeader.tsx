"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Portfolio" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--blueprint-line)]/20 bg-[var(--blueprint-navy)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold tracking-tight text-[var(--paper)]"
        >
          Engineer Danyal
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mono text-[10px] tracking-wider uppercase transition md:text-xs ${
                  active
                    ? "text-[var(--signal-amber)]"
                    : "text-[var(--paper)]/70 hover:text-[var(--paper)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
