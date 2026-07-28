"use client";

import Link from "next/link";
import { Plate, PaperCard } from "@/components/admin/ui";

const SECTIONS = [
  { href: "/admin/profile", title: "Profile", blurb: "Name, about, resume upload" },
  { href: "/admin/skills", title: "Skills", blurb: "Categories and proficiency" },
  { href: "/admin/certifications", title: "Certifications", blurb: "Badges and verify links" },
  { href: "/admin/projects", title: "Projects", blurb: "Case studies and featured work" },
  { href: "/admin/experience", title: "Experience", blurb: "Timeline entries" },
  { href: "/admin/blogs", title: "Blogs", blurb: "Posts, tags, publish state" },
  { href: "/admin/contact", title: "Contact", blurb: "Public contact settings" },
  { href: "/admin/submissions", title: "Submissions", blurb: "Inbound contact messages" },
];

export default function AdminHomePage() {
  return (
    <Plate label="FIG. A01 — OVERVIEW">
      <h1 className="text-3xl font-semibold tracking-tight">Content desk</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--paper)]/70">
        Manage portfolio content. Public pages will consume this data in Step 6.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <PaperCard>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-1 text-sm text-[var(--ink)]/70">{section.blurb}</p>
            </PaperCard>
          </Link>
        ))}
      </div>
    </Plate>
  );
}
