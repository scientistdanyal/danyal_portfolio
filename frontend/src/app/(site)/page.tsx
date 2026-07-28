import Link from "next/link";
import { HeroSchematic } from "@/components/site/HeroSchematic";
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
      <Plate label="FIG. 01 — PORTFOLIO">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Engineer Danyal
        </h1>
        <p className="mt-4 max-w-xl text-[var(--paper)]/70">
          Profile content is not set yet. Add it from the admin panel.
        </p>
      </Plate>
    );
  }

  const photo = mediaUrl(profile.image);
  const resume = mediaUrl(profile.resumeUrl);

  return (
    <>
      <Plate label="FIG. 01 — PORTFOLIO" className="!pt-10 md:!pt-16">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-[var(--paper)] sm:text-6xl lg:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-4 mono text-sm text-[var(--signal-amber)] md:text-base">
              {profile.title}
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--paper)]/75">
              {profile.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded bg-[var(--signal-amber)] px-5 py-2.5 mono text-xs tracking-wider text-[var(--ink)]"
              >
                VIEW WORK
              </Link>
              {resume ? (
                <a
                  href={resume}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded border border-[var(--blueprint-line)]/50 px-5 py-2.5 mono text-xs tracking-wider text-[var(--blueprint-line)] hover:border-[var(--signal-amber)] hover:text-[var(--signal-amber)]"
                >
                  DOWNLOAD RÉSUMÉ
                </a>
              ) : null}
            </div>
            <HeroSchematic />
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="aspect-[4/5] overflow-hidden border border-[var(--blueprint-line)]/30 bg-[var(--blueprint-navy)]">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center mono text-xs text-[var(--blueprint-line)]">
                  PHOTO
                </div>
              )}
            </div>
            <svg
              className="pointer-events-none absolute -right-2 top-8 hidden h-24 w-40 text-[var(--blueprint-line)] md:block"
              viewBox="0 0 160 96"
              aria-hidden
            >
              <path
                d="M8 48 H90 L120 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="8" cy="48" r="3" fill="var(--signal-amber)" />
            </svg>
            <p className="mt-3 mono text-[10px] tracking-wider text-[var(--blueprint-line)] md:absolute md:-right-2 md:top-2 md:mt-0 md:max-w-[9rem] md:text-right">
              BASED IN {profile.location.toUpperCase()}
            </p>
          </div>
        </div>
      </Plate>

      <Reveal>
        <Plate label="FIG. 02 — ABOUT">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">About</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-[var(--paper)]/80">
                {profile.longDescription}
              </p>
            </div>
            <div>
              <h3 className="mono text-xs tracking-widest text-[var(--blueprint-line)]">
                EDUCATION
              </h3>
              <ul className="mt-4 space-y-4">
                {profile.education.length === 0 ? (
                  <li className="text-sm text-[var(--paper)]/60">
                    No education entries yet.
                  </li>
                ) : (
                  profile.education.map((ed) => (
                    <li key={ed.id} className="border-l border-[var(--blueprint-line)]/40 pl-4">
                      <p className="mono text-[10px] text-[var(--signal-amber)]">
                        {formatDate(ed.startDate)}
                        {ed.endDate ? ` — ${formatDate(ed.endDate)}` : " — Present"}
                      </p>
                      <p className="mt-1 font-medium">{ed.degree}</p>
                      <p className="text-sm text-[var(--paper)]/70">
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

      <Reveal>
        <Plate label="FIG. 03 — SELECTED WORK">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">Selected work</h2>
            <Link
              href="/projects"
              className="mono text-xs tracking-wider text-[var(--blueprint-line)] hover:text-[var(--signal-amber)]"
            >
              VIEW ALL PROJECTS →
            </Link>
          </div>
          {profile.projectsSummary.length === 0 ? (
            <p className="text-sm text-[var(--paper)]/70">
              No featured projects yet.
            </p>
          ) : (
            <ProjectGrid projects={profile.projectsSummary} />
          )}
        </Plate>
      </Reveal>

      <Reveal>
        <Plate label="FIG. 04 — EXPERIENCE">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight">Experience</h2>
            <Link
              href="/experience"
              className="mono text-xs tracking-wider text-[var(--blueprint-line)] hover:text-[var(--signal-amber)]"
            >
              VIEW FULL HISTORY →
            </Link>
          </div>
          <ExperienceTimeline items={profile.experienceSummary} compact />
        </Plate>
      </Reveal>
    </>
  );
}
