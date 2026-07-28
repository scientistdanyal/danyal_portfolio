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
        <Plate label="FIG. 05 — SKILLS" className="!pt-10 md:!pt-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Skills
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--paper)]/70">
            Stack inventory by category. Bars read like an instrument panel.
          </p>

          {categories.length === 0 ? (
            <p className="mt-8 text-sm text-[var(--paper)]/70">
              No skills published yet.
            </p>
          ) : (
            <div className="mt-10 space-y-10">
              {categories.map((category) => (
                <div key={category.id}>
                  <h2 className="mono text-xs tracking-widest text-[var(--blueprint-line)]">
                    {category.name.toUpperCase()}
                  </h2>
                  <ul className="mt-4 space-y-4">
                    {category.skills.map((skill) => (
                      <li key={skill.id}>
                        <div className="mb-1.5 flex items-baseline justify-between gap-3">
                          <span className="mono text-sm">{skill.name}</span>
                          <span className="mono text-[10px] text-[var(--paper)]/40">
                            {skill.type}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-sm bg-[var(--paper)]/10">
                          <div
                            className="h-full rounded-sm bg-[var(--circuit-teal)]"
                            style={{ width: `${Math.min(100, skill.proficiency)}%` }}
                          />
                        </div>
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
        <Plate label="FIG. 06 — CERTIFICATIONS">
          <h2 className="text-3xl font-semibold tracking-tight">Certifications</h2>
          {certifications.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--paper)]/70">
              No certifications published yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => {
                const badge = mediaUrl(cert.image);
                return (
                  <article key={cert.id} className="paper-card p-5">
                    {badge ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={badge}
                        alt=""
                        className="mb-4 h-12 w-12 object-contain"
                      />
                    ) : null}
                    <h3 className="font-semibold">{cert.certificationName}</h3>
                    <p className="mt-1 mono text-[10px] text-[var(--ink)]/60">
                      {cert.organization}
                    </p>
                    <p className="mt-2 mono text-[10px] text-[var(--ink)]/50">
                      {formatDate(cert.dateCompleted)}
                    </p>
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block mono text-[10px] tracking-wider text-[var(--circuit-teal)] hover:underline"
                      >
                        VERIFY →
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </Plate>
      </Reveal>
    </>
  );
}
