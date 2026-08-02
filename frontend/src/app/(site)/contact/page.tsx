import { ContactForm } from "@/components/site/ContactForm";
import { Plate } from "@/components/site/Plate";
import { Reveal } from "@/components/site/Reveal";
import { publicApi } from "@/lib/public-data";

export const revalidate = 60;

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const settings = await publicApi.contact();

  return (
    <Reveal>
      <Plate eyebrow="Contact" className="!pt-10 md:!pt-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Let&apos;s Work Together
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--fg-muted)]">
          Have a project in mind? Send a direct message — no popups, no
          third-party forms.
        </p>
        <div className="mt-10">
          <ContactForm settings={settings} />
        </div>
      </Plate>
    </Reveal>
  );
}
