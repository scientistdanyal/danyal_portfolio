"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/submissions", label: "Submissions" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function onLogout() {
    await logout();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="blueprint-grid min-h-screen text-[var(--paper)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] gap-8 px-4 py-8 md:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-widest text-[var(--blueprint-line)]">
            FIG. A — ADMIN
          </p>
          <div className="mt-2 h-px w-full bg-[var(--blueprint-line)]/40" />
          <p className="mt-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--signal-amber)]">
            {email}
          </p>
          <nav className="mt-6 flex flex-col gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs transition ${
                    active
                      ? "bg-[var(--signal-amber)] text-[var(--ink)]"
                      : "text-[var(--paper)]/80 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="mt-8 w-full rounded border border-[var(--blueprint-line)]/40 px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--blueprint-line)] hover:border-[var(--signal-amber)] hover:text-[var(--signal-amber)]"
          >
            Log out
          </button>
        </aside>
        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap gap-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded border border-[var(--blueprint-line)]/30 px-2 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
