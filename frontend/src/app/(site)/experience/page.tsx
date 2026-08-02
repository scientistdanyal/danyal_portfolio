import { ExperienceTimeline } from "@/components/site/ExperienceTimeline";
import { Plate } from "@/components/site/Plate";
import { Reveal } from "@/components/site/Reveal";
import { publicApi } from "@/lib/public-data";

export const revalidate = 60;

export const metadata = {
  title: "Experience",
};

export default async function ExperiencePage() {
  const experience = await publicApi.experience();

  return (
    <Reveal>
      <Plate eyebrow="Experience" className="!pt-10 md:!pt-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Experience
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--fg-muted)]">
          Roles, problems solved, and the stack used to ship them.
        </p>
        <div className="mt-10">
          <ExperienceTimeline items={experience} />
        </div>
      </Plate>
    </Reveal>
  );
}
