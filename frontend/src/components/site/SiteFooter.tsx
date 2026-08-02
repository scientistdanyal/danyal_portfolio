import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight md:text-4xl">
              Ready to build<br />
              something <span className="text-[var(--accent)]">great</span>?
            </p>
            <Link href="/contact" className="btn-primary mt-6">
              Start a conversation
            </Link>
          </div>

          <div>
            <p className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">
              Quick Links
            </p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/projects", label: "Projects" },
                { href: "/experience", label: "Experience" },
                { href: "/blogs", label: "Blogs" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">
              Social
            </p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {[
                { href: "https://github.com/scientistdanyal", label: "GitHub" },
                { href: "https://linkedin.com/in/devdanyal", label: "LinkedIn" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="section-rule mt-12" />
        <p className="mt-6 mono text-[10px] text-[var(--fg-muted)]">
          &copy; {new Date().getFullYear()} Danyal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
