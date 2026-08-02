import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-5 md:px-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
