import Link from "next/link";
import { Plate } from "@/components/site/Plate";
import { Reveal } from "@/components/site/Reveal";
import { formatDate, publicApi } from "@/lib/public-data";

export const revalidate = 60;

export const metadata = {
  title: "Blogs",
};

export default async function BlogsPage() {
  const blogs = await publicApi.blogs();

  return (
    <Reveal>
      <Plate eyebrow="Blogs" className="!pt-10 md:!pt-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Developer Insights &amp; Ideas
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--fg-muted)]">
          Notes on building and shipping software.
        </p>

        <div className="mt-10 space-y-0">
          {blogs.length === 0 ? (
            <p className="py-6 text-sm text-[var(--fg-muted)]">
              No blogs published yet.
            </p>
          ) : (
            blogs.map((post, i) => (
              <article key={post.id} className="border-b border-[var(--border)] py-8 first:pt-0 last:border-b-0">
                <Link href={`/blogs/${post.slug}`} className="group block">
                  <div className="flex items-start gap-4">
                    <span className="mono mt-1 shrink-0 text-3xl font-bold text-[var(--bg-alt)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--accent)]">
                        {post.title}
                      </h2>
                      <p className="mt-2 max-w-3xl text-[var(--fg-muted)]">
                        {post.abstract}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="mono text-[11px] text-[var(--fg-muted)]">
                          {formatDate(post.publishedDate)}
                        </span>
                        {post.readTime ? (
                          <span className="mono text-[11px] text-[var(--fg-muted)]">
                            {post.readTime}
                          </span>
                        ) : null}
                        {post.tags?.map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </Plate>
    </Reveal>
  );
}
