import Link from "next/link";
import { Plate } from "@/components/site/Plate";
import { Reveal } from "@/components/site/Reveal";
import { mediaUrl } from "@/lib/api";
import { formatDate, publicApi } from "@/lib/public-data";

export const revalidate = 60;

export const metadata = {
  title: "Skills & Certifications",
};

export default async function SkillsPage() {
  const [categories, certifications] = await Promise.all([
    publicApi.skills(),
    publicApi.certifications(),
  ]);

  return (
    <>
      <Reveal>
        <Plate eyebrow="Skills" className="!pt-10 md:!pt-16">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Technologies I build with
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--fg-muted)]">
            A focused stack across frontend, backend, and AI — chosen for
            shipping clean, maintainable products.
          </p>

          {categories.length === 0 ? (
            <p className="mt-10 text-sm text-[var(--fg-muted)]">
              No skills published yet.
            </p>
          ) : (
            <div className="mt-16 space-y-0">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="grid gap-6 border-t border-[var(--border)] py-10 md:grid-cols-[220px_1fr] md:gap-12 lg:grid-cols-[280px_1fr]"
                >
                  <div>
                    <span className="mono text-[11px] tracking-wider text-[var(--fg-muted)]">
                      ({String(index + 1).padStart(2, "0")})
                    </span>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                      {category.name}
                    </h2>
                    <p className="mt-2 mono text-[11px] text-[var(--fg-muted)]">
                      {category.skills.length}{" "}
                      {category.skills.length === 1 ? "skill" : "skills"}
                    </p>
                  </div>

                  <ul className="flex flex-wrap content-start gap-3">
                    {category.skills.map((skill) => (
                      <li key={skill.id}>
                        <span className="group inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-transparent px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-[var(--fg)] hover:text-[var(--bg)]">
                          {skill.name}
                          <span className="mono text-[9px] uppercase tracking-wider text-[var(--fg-muted)] group-hover:text-[var(--bg)]/60">
                            {skill.type}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Plate>
      </Reveal>

      <Reveal>
        <Plate eyebrow="Certifications">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Credentials &amp; coursework
            </h2>
            <p className="mono text-[11px] text-[var(--fg-muted)]">
              {certifications.length} verified
            </p>
          </div>

          {certifications.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">
              No certifications published yet.
            </p>
          ) : (
            <ul className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
              {certifications.map((cert, index) => {
                const badge = mediaUrl(cert.image);
                const row = (
                  <div className="grid items-center gap-4 py-6 sm:grid-cols-[auto_1fr_auto] md:grid-cols-[48px_1fr_160px_auto]">
                    <span className="mono hidden text-[11px] text-[var(--fg-muted)] md:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-start gap-4">
                      {badge ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={badge}
                          alt=""
                          className="mt-0.5 h-10 w-10 shrink-0 rounded-lg object-contain"
                        />
                      ) : (
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-alt)] mono text-[10px] text-[var(--fg-muted)]">
                          {cert.organization.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <h3 className="font-semibold leading-snug transition-colors group-hover:text-[var(--accent)]">
                          {cert.certificationName}
                        </h3>
                        <p className="mt-1 mono text-[11px] text-[var(--fg-muted)]">
                          {cert.organization}
                        </p>
                      </div>
                    </div>
                    <p className="mono text-[11px] text-[var(--fg-muted)] sm:text-right md:text-left">
                      {formatDate(cert.dateCompleted)}
                    </p>
                    {cert.credentialUrl ? (
                      <span className="mono text-[11px] tracking-wider text-[var(--accent)] sm:text-right">
                        Verify &rarr;
                      </span>
                    ) : (
                      <span className="hidden md:block" />
                    )}
                  </div>
                );

                return (
                  <li key={cert.id}>
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group block transition-colors hover:bg-[var(--bg-alt)]/60"
                      >
                        {row}
                      </a>
                    ) : (
                      row
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-12">
            <Link href="/contact" className="btn-primary">
              Let&apos;s work together
            </Link>
          </div>
        </Plate>
      </Reveal>
    </>
  );
}
