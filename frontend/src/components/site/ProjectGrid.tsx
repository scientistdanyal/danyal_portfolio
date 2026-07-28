"use client";

import { useEffect, useId, useState } from "react";
import { mediaUrl } from "@/lib/api";
import { publicApi, type Project } from "@/lib/public-data";

export function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  const cover = mediaUrl(project.coverImage);

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="paper-card group w-full overflow-hidden text-left"
    >
      <div className="aspect-[16/10] bg-[var(--blueprint-navy)]/10">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center mono text-[10px] text-[var(--ink)]/40">
            NO COVER
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold tracking-tight">
          {project.projectName}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--ink)]/75">
          {project.tagline}
        </p>
        {project.client ? (
          <p className="mt-2 mono text-[10px] text-[var(--ink)]/50">
            {project.client}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="tag mono rounded px-2 py-0.5 text-[10px]">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  const study = project.caseStudy;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="max-h-[100dvh] w-full overflow-y-auto bg-[var(--paper)] text-[var(--ink)] md:max-h-[90vh] md:max-w-3xl md:rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--ink)]/10 bg-[var(--paper)] px-5 py-4">
          <p className="mono text-[10px] tracking-widest text-[var(--ink)]/50">
            CASE STUDY
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mono text-xs text-[var(--ink)]/70 hover:text-[var(--ink)]"
          >
            CLOSE
          </button>
        </div>
        <div className="space-y-6 p-5 md:p-8">
          <div>
            <h2
              id={titleId}
              className="text-2xl font-semibold tracking-tight md:text-3xl"
            >
              {project.projectName}
            </h2>
            <p className="mt-2 text-[var(--ink)]/75">{project.tagline}</p>
          </div>

          {study?.overview ? (
            <div>
              <h3 className="mono text-[10px] tracking-widest text-[var(--ink)]/50">
                OVERVIEW
              </h3>
              <p className="mt-2 leading-relaxed">{study.overview}</p>
            </div>
          ) : null}

          {study?.problemStatement ? (
            <div>
              <h3 className="mono text-[10px] tracking-widest text-[var(--ink)]/50">
                PROBLEM
              </h3>
              <p className="mt-2 leading-relaxed">{study.problemStatement}</p>
            </div>
          ) : null}

          {study?.solution ? (
            <div>
              <h3 className="mono text-[10px] tracking-widest text-[var(--ink)]/50">
                SOLUTION
              </h3>
              <p className="mt-2 leading-relaxed">{study.solution}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 mono text-xs text-[var(--ink)]/70">
            {study?.role ? <span>Role: {study.role}</span> : null}
            {study?.duration ? <span>Duration: {study.duration}</span> : null}
          </div>

          {study?.resultsImpact ? (
            <div>
              <h3 className="mono text-[10px] tracking-widest text-[var(--ink)]/50">
                RESULTS
              </h3>
              <p className="mt-2 leading-relaxed">{study.resultsImpact}</p>
            </div>
          ) : null}

          {study?.screenshots?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {study.screenshots.map((shot) => {
                const src = mediaUrl(shot);
                if (!src) return null;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={shot}
                    src={src}
                    alt=""
                    className="w-full rounded border border-[var(--ink)]/10"
                  />
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="tag mono rounded px-2 py-0.5 text-[10px]"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex mono text-xs tracking-wider text-[var(--circuit-teal)] hover:underline"
            >
              VISIT LIVE SITE →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);

  async function onOpen(project: Project) {
    try {
      const full = await publicApi.project(project.id);
      setActive(full);
    } catch {
      setActive(project);
    }
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={(p) => void onOpen(p)}
          />
        ))}
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}
