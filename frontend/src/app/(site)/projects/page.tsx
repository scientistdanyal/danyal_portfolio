import { Plate } from "@/components/site/Plate";
import { ProjectGrid } from "@/components/site/ProjectGrid";
import { Reveal } from "@/components/site/Reveal";
import { publicApi } from "@/lib/public-data";

export const revalidate = 60;

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = await publicApi.projects();

  return (
    <Reveal>
      <Plate label="FIG. 07 — PROJECTS" className="!pt-10 md:!pt-16">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--paper)]/70">
          Case studies and shipped work. Open a card for problem, solution, and results.
        </p>
        <div className="mt-10">
          {projects.length === 0 ? (
            <p className="text-sm text-[var(--paper)]/70">No projects yet.</p>
          ) : (
            <ProjectGrid projects={projects} />
          )}
        </div>
      </Plate>
    </Reveal>
  );
}
