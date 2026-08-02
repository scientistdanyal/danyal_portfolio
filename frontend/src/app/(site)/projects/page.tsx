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
      <Plate eyebrow="Projects" className="!pt-10 md:!pt-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--fg-muted)]">
          Case studies and shipped work. Open a card for the full story.
        </p>
        <div className="mt-10">
          {projects.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)]">No projects yet.</p>
          ) : (
            <ProjectGrid projects={projects} />
          )}
        </div>
      </Plate>
    </Reveal>
  );
}
