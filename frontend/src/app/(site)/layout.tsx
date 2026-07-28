import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

/** Always render from the live API — avoids build-time fetch failures in Docker. */
export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blueprint-grid flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 md:px-6">
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
