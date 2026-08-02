"use client";

import { useEffect, useId, useState } from "react";
import { mediaUrl } from "@/lib/api";
import { publicApi, type Project } from "@/lib/public-data";

export function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  const cover = mediaUrl(project.coverImage);

  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="card group w-full overflow-hidden text-left"
    >
      <div className="aspect-[16/10] overflow-hidden bg-[var(--bg-alt)]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center mono text-[10px] text-[var(--fg-muted)]">
            NO COVER
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">
            {project.projectName}
          </h3>
          <span className="mono mt-1 shrink-0 text-[11px] text-[var(--fg-muted)]">
            ({String(index + 1).padStart(2, "0")})
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--fg-muted)]">
          {project.tagline}
        </p>
        {project.client ? (
          <p className="mt-2 mono text-[10px] text-[var(--fg-muted)]">
            {project.client}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="tag">
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="max-h-[100dvh] w-full overflow-y-auto rounded-t-2xl bg-white text-[var(--fg)] md:max-h-[90vh] md:max-w-3xl md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--border)] bg-white px-6 py-4 md:rounded-t-2xl">
          <p className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">
            Case Study
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mono text-xs text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
          >
            CLOSE &times;
          </button>
        </div>
        <div className="space-y-6 p-6 md:p-8">
          <div>
            <h2
              id={titleId}
              className="text-2xl font-bold tracking-tight md:text-3xl"
            >
              {project.projectName}
            </h2>
            <p className="mt-2 text-[var(--fg-muted)]">{project.tagline}</p>
          </div>

          {study?.overview ? (
            <div>
              <h3 className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">
                Overview
              </h3>
              <p className="mt-2 leading-relaxed">{study.overview}</p>
            </div>
          ) : null}

          {study?.problemStatement ? (
            <div>
              <h3 className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">
                Problem
              </h3>
              <p className="mt-2 leading-relaxed">{study.problemStatement}</p>
            </div>
          ) : null}

          {study?.solution ? (
            <div>
              <h3 className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">
                Solution
              </h3>
              <p className="mt-2 leading-relaxed">{study.solution}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-4 mono text-xs text-[var(--fg-muted)]">
            {study?.role ? <span>Role: {study.role}</span> : null}
            {study?.duration ? <span>Duration: {study.duration}</span> : null}
          </div>

          {study?.resultsImpact ? (
            <div>
              <h3 className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">
                Results
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
                    className="w-full rounded-xl border border-[var(--border)]"
                  />
                );
              })}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="tag">{tech}</span>
            ))}
          </div>

          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex"
            >
              Visit Live Site &rarr;
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onOpen={(p) => void onOpen(p)}
          />
        ))}
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </>
  );
}
