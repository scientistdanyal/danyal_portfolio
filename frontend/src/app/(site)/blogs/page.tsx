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
      <Plate label="FIG. 09 — BLOGS" className="!pt-10 md:!pt-16">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Blogs
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--paper)]/70">
          Notes on building and shipping software.
        </p>

        <div className="mt-10 divide-y divide-[var(--blueprint-line)]/20">
          {blogs.length === 0 ? (
            <p className="py-6 text-sm text-[var(--paper)]/70">
              No blogs published yet.
            </p>
          ) : (
            blogs.map((post) => (
              <article key={post.id} className="py-6">
                <Link href={`/blogs/${post.slug}`} className="group block">
                  <h2 className="text-2xl font-semibold tracking-tight group-hover:text-[var(--signal-amber)]">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-[var(--paper)]/75">
                    {post.abstract}
                  </p>
                  <p className="mt-3 mono text-[10px] tracking-wider text-[var(--blueprint-line)]">
                    {formatDate(post.publishedDate)}
                    {post.readTime ? ` · ${post.readTime}` : ""}
                    {post.tags?.length ? ` · ${post.tags.join(" · ")}` : ""}
                  </p>
                </Link>
              </article>
            ))
          )}
        </div>
      </Plate>
    </Reveal>
  );
}
