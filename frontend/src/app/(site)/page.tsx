import Link from "next/link";
import { Plate } from "@/components/site/Plate";
import { Reveal } from "@/components/site/Reveal";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { ExperienceTimeline } from "@/components/site/ExperienceTimeline";
import { mediaUrl } from "@/lib/api";
import { formatDate, publicApi } from "@/lib/public-data";

export const revalidate = 60;

export default async function HomePage() {
  const profile = await publicApi.profile();

  if (!profile) {
    return (
      <section className="py-24">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          Danyal
        </h1>
        <p className="mt-4 max-w-xl text-[var(--fg-muted)]">
          Profile content is not set yet. Add it from the admin panel.
        </p>
      </section>
    );
  }

  const photo = mediaUrl(profile.image);
  const resume = mediaUrl(profile.resumeUrl);

  return (
    <>
      {/* ── Hero ── */}
      <section className="pb-16 pt-12 md:pb-24 md:pt-20">
        <Reveal>
          <p className="mono text-sm text-[var(--fg-muted)]">
            Hey, <span className="text-2xl">&#x1F44B;</span> I&apos;m a
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
            {profile.title.split(" ").length > 2
              ? profile.title
              : `Full-Stack\nDeveloper`}
          </h1>
        </Reveal>

        <div className="section-rule-strong mt-8" />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="reveal-delay-1">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {profile.name}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--fg-muted)]">
              {profile.shortDescription}
            </p>

            <div className="mt-6 space-y-1 mono text-sm text-[var(--fg-muted)]">
              {profile.socialLinks?.find((s) => s.platform.toLowerCase().includes("email") || s.url.includes("mailto")) ? null : (
                <p>
                  <span className="mr-2 text-[var(--fg)]">E</span>{" "}
                  {profile.location ? `Based in ${profile.location}` : ""}
                </p>
              )}
              {profile.socialLinks?.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-[var(--fg)]"
                >
                  <span className="text-[var(--fg)]">/</span>{" "}
                  {link.platform}
                </a>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">
                View Work
              </Link>
              {resume ? (
                <a href={resume} target="_blank" rel="noreferrer" className="btn-outline">
                  Download R&eacute;sum&eacute;
                </a>
              ) : null}
            </div>
          </Reveal>

          <Reveal className="reveal-delay-2">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--bg-alt)]">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center mono text-xs text-[var(--fg-muted)]">
                    PHOTO
                  </div>
                )}
              </div>
              {profile.location ? (
                <p className="mt-3 mono text-[11px] text-[var(--fg-muted)]">
                  Based in {profile.location}
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Skills marquee ── */}
      <Reveal>
        <section className="overflow-hidden border-y border-[var(--border)] py-5">
          <div className="marquee-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex shrink-0 items-center gap-8 px-4">
                {["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "Docker", "Next.js", "Express", "Tailwind CSS", "Git"].map(
                  (tech) => (
                    <span key={`${i}-${tech}`} className="mono text-sm whitespace-nowrap text-[var(--fg-muted)]">
                      {tech}
                    </span>
                  ),
                )}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── About ── */}
      <Reveal>
        <Plate eyebrow="About">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="whitespace-pre-line text-lg leading-relaxed text-[var(--fg)]/85">
                {profile.longDescription}
              </p>
              {resume ? (
                <a href={resume} target="_blank" rel="noreferrer" className="btn-outline mt-8">
                  My Resume
                </a>
              ) : null}
            </div>
            <div>
              <p className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">
                Education
              </p>
              <ul className="mt-6 space-y-6">
                {profile.education.length === 0 ? (
                  <li className="text-sm text-[var(--fg-muted)]">No education entries yet.</li>
                ) : (
                  profile.education.map((ed) => (
                    <li key={ed.id} className="border-l-2 border-[var(--accent)] pl-5">
                      <p className="mono text-[11px] text-[var(--fg-muted)]">
                        {formatDate(ed.startDate)}
                        {ed.endDate ? ` — ${formatDate(ed.endDate)}` : " — Present"}
                      </p>
                      <p className="mt-1 text-lg font-semibold">{ed.degree}</p>
                      <p className="text-sm text-[var(--fg-muted)]">
                        {ed.institution}
                        {ed.fieldOfStudy ? ` · ${ed.fieldOfStudy}` : ""}
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </Plate>
      </Reveal>

      {/* ── Selected Projects ── */}
      <Reveal>
        <Plate eyebrow="Explore Work">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              A Showcase of My Latest Projects
            </h2>
            <Link href="/projects" className="btn-outline shrink-0">
              View All Projects
            </Link>
          </div>
          {profile.projectsSummary.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No featured projects yet.</p>
          ) : (
            <ProjectGrid projects={profile.projectsSummary} />
          )}
        </Plate>
      </Reveal>

      {/* ── Experience ── */}
      <Reveal>
        <Plate eyebrow="Experience">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Career Journey
            </h2>
            <Link href="/experience" className="btn-outline shrink-0">
              View Full History
            </Link>
          </div>
          <ExperienceTimeline items={profile.experienceSummary} compact />
        </Plate>
      </Reveal>

      {/* ── CTA ── */}
      <Reveal>
        <section className="mb-16 rounded-2xl bg-[var(--fg)] px-8 py-16 text-center text-[var(--bg)] md:py-24">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Ready to take your idea<br className="hidden sm:block" /> to the next level?
          </h2>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 mono text-xs tracking-wider text-white transition hover:bg-[var(--accent-light)]">
            Start a Project
          </Link>
        </section>
      </Reveal>
    </>
  );
}
