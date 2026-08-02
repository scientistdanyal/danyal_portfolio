import Link from "next/link";
import { notFound } from "next/navigation";
import { Plate } from "@/components/site/Plate";
import { mediaUrl } from "@/lib/api";
import { renderInlineMarkdown } from "@/lib/inline-markdown";
import { formatDate, publicApi, type ContentBlock } from "@/lib/public-data";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const post = await publicApi.blog(slug);
    return { title: post.title, description: post.abstract };
  } catch {
    return { title: "Post" };
  }
}

function StoryBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="mt-10 max-w-3xl space-y-6">
      {blocks.map((block) => {
        if (block.type === "paragraph") {
          if (!block.text.trim()) return null;
          return (
            <p
              key={block.id}
              className="whitespace-pre-line text-lg leading-relaxed text-[var(--fg)]/85 [&_em]:italic [&_strong]:font-semibold [&_strong]:text-[var(--fg)]"
              dangerouslySetInnerHTML={{
                __html: renderInlineMarkdown(block.text),
              }}
            />
          );
        }
        if (block.type === "image") {
          const src = mediaUrl(block.url);
          if (!src) return null;
          return (
            <figure key={block.id} className="my-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={block.alt ?? ""}
                className="w-full rounded-xl border border-[var(--border)]"
              />
              {block.alt ? (
                <figcaption className="mt-2 text-center mono text-[11px] text-[var(--fg-muted)]">
                  {block.alt}
                </figcaption>
              ) : null}
            </figure>
          );
        }
        return (
          <pre
            key={block.id}
            className="overflow-x-auto rounded-xl bg-[var(--code-bg)] p-5 mono text-xs leading-relaxed text-[var(--code-fg)]"
          >
            <code>
              {`// ${block.language}\n`}
              {block.code}
            </code>
          </pre>
        );
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await publicApi.blog(slug);
  } catch {
    notFound();
  }

  return (
    <Plate eyebrow="Blog" className="!pt-10 md:!pt-16">
      <Link
        href="/blogs"
        className="mono text-[11px] tracking-wider text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
      >
        &larr; Back to Blogs
      </Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
        {post.title}
      </h1>
      <div className="mt-3 flex flex-wrap gap-3">
        <span className="mono text-[11px] text-[var(--fg-muted)]">
          {formatDate(post.publishedDate)}
        </span>
        {post.readTime ? (
          <span className="mono text-[11px] text-[var(--fg-muted)]">
            {post.readTime}
          </span>
        ) : null}
      </div>
      <p className="mt-6 max-w-3xl text-lg text-[var(--fg-muted)]">
        {post.abstract}
      </p>
      <StoryBody blocks={post.content ?? []} />
    </Plate>
  );
}
