"use client";

import { FormEvent, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useLoadOnMount } from "@/hooks/useLoadOnMount";
import {
  Field,
  PaperCard,
  Plate,
  buttonClass,
  ghostButtonClass,
  inputClass,
} from "@/components/admin/ui";
import {
  StoryEditor,
  emptyStory,
  type StoryBlock,
} from "@/components/admin/StoryEditor";

type Blog = {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content: StoryBlock[];
  tags: string[];
  published: boolean;
  publishedDate: string;
  readTime?: string | null;
  category?: string | null;
  coverImage?: string | null;
};

type Meta = {
  title: string;
  slug: string;
  abstract: string;
  tags: string;
  publishedDate: string;
  readTime: string;
  category: string;
  published: boolean;
};

const emptyMeta = (): Meta => ({
  title: "",
  slug: "",
  abstract: "",
  tags: "",
  publishedDate: new Date().toISOString().slice(0, 10),
  readTime: "",
  category: "",
  published: false,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminBlogsPage() {
  const [items, setItems] = useState<Blog[]>([]);
  const [meta, setMeta] = useState<Meta>(emptyMeta);
  const [blocks, setBlocks] = useState<StoryBlock[]>(emptyStory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setItems(await api<Blog[]>("/api/admin/blogs"));
  }

  const { error } = useLoadOnMount(load);

  function resetEditor() {
    setEditingId(null);
    setMeta(emptyMeta());
    setBlocks(emptyStory());
    setSlugTouched(false);
    setFormError(null);
    setMessage(null);
  }

  function startEdit(blog: Blog) {
    setEditingId(blog.id);
    setSlugTouched(true);
    setMeta({
      title: blog.title,
      slug: blog.slug,
      abstract: blog.abstract,
      tags: (blog.tags ?? []).join(", "),
      publishedDate: blog.publishedDate.slice(0, 10),
      readTime: blog.readTime ?? "",
      category: blog.category ?? "",
      published: blog.published,
    });
    setBlocks(
      blog.content?.length
        ? blog.content
        : emptyStory(),
    );
    setFormError(null);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    setMessage(null);
    try {
      const payload = {
        title: meta.title,
        slug: meta.slug || slugify(meta.title),
        abstract: meta.abstract,
        content: blocks,
        tags: meta.tags.split(",").map((s) => s.trim()).filter(Boolean),
        publishedDate: meta.publishedDate,
        readTime: meta.readTime || null,
        category: meta.category || null,
        published: meta.published,
      };

      if (editingId) {
        await api(`/api/admin/blogs/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
        setMessage("Draft saved");
      } else {
        const created = await api<Blog>("/api/admin/blogs", {
          method: "POST",
          body: payload,
        });
        setEditingId(created.id);
        setMessage("Story created");
      }
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(blog: Blog) {
    await api(`/api/admin/blogs/${blog.id}`, {
      method: "PATCH",
      body: { published: !blog.published },
    });
    await load();
  }

  async function onDelete(id: string) {
    await api(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (editingId === id) resetEditor();
    await load();
  }

  return (
    <Plate label="FIG. A07 — BLOGS">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Write</h1>
          <p className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--blueprint-line)]">
            {editingId ? "Editing draft" : "New story"} · + for Bold, Italic, Image URL, Code
          </p>
        </div>
        {editingId ? (
          <button type="button" className={ghostButtonClass} onClick={resetEditor}>
            New story
          </button>
        ) : null}
      </div>

      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}

      <form onSubmit={(e) => void onSave(e)} className="space-y-6">
        {/* Medium-like writing surface */}
        <div className="rounded bg-[var(--paper)] px-4 py-8 text-[var(--ink)] shadow-sm sm:px-10 sm:py-12">
          <input
            value={meta.title}
            onChange={(e) => {
              const title = e.target.value;
              setMeta((p) => ({
                ...p,
                title,
                slug: slugTouched ? p.slug : slugify(title),
              }));
            }}
            placeholder="Title"
            required
            className="w-full border-0 bg-transparent font-[family-name:var(--font-space-grotesk)] text-4xl font-semibold tracking-tight text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/25 sm:text-5xl"
          />
          <input
            value={meta.abstract}
            onChange={(e) =>
              setMeta((p) => ({ ...p, abstract: e.target.value }))
            }
            placeholder="Subtitle / abstract for the listing page"
            required
            className="mt-4 w-full border-0 bg-transparent text-xl text-[var(--ink)]/70 outline-none placeholder:text-[var(--ink)]/25"
          />
          <div className="mt-8 border-t border-[var(--ink)]/10 pt-6">
            <StoryEditor blocks={blocks} onChange={setBlocks} />
          </div>
        </div>

        {/* Publishing meta — secondary, not in the writing flow */}
        <details className="rounded border border-[var(--blueprint-line)]/25 p-4">
          <summary className="cursor-pointer font-[family-name:var(--font-jetbrains-mono)] text-xs tracking-wider text-[var(--blueprint-line)]">
            PUBLISH SETTINGS
          </summary>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Slug">
              <input
                className={inputClass}
                value={meta.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setMeta((p) => ({ ...p, slug: e.target.value }));
                }}
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              />
            </Field>
            <Field label="Published date">
              <input
                className={inputClass}
                type="date"
                value={meta.publishedDate}
                onChange={(e) =>
                  setMeta((p) => ({ ...p, publishedDate: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                className={inputClass}
                value={meta.tags}
                onChange={(e) => setMeta((p) => ({ ...p, tags: e.target.value }))}
              />
            </Field>
            <Field label="Read time">
              <input
                className={inputClass}
                value={meta.readTime}
                onChange={(e) =>
                  setMeta((p) => ({ ...p, readTime: e.target.value }))
                }
                placeholder="5 min read"
              />
            </Field>
            <Field label="Category">
              <input
                className={inputClass}
                value={meta.category}
                onChange={(e) =>
                  setMeta((p) => ({ ...p, category: e.target.value }))
                }
              />
            </Field>
            <label className="flex items-center gap-2 self-end font-[family-name:var(--font-jetbrains-mono)] text-xs">
              <input
                type="checkbox"
                checked={meta.published}
                onChange={(e) =>
                  setMeta((p) => ({ ...p, published: e.target.checked }))
                }
              />
              Published
            </label>
          </div>
        </details>

        {formError ? <p className="text-sm text-red-400">{formError}</p> : null}
        {message ? (
          <p className="text-sm text-[var(--circuit-teal)]">{message}</p>
        ) : null}

        <button type="submit" className={buttonClass} disabled={saving}>
          {saving ? "Saving…" : editingId ? "Save story" : "Create story"}
        </button>
      </form>

      <div className="mt-12 space-y-3">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-widest text-[var(--blueprint-line)]">
          ALL STORIES
        </p>
        {items.map((item) => (
          <PaperCard key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--ink)]/70">
                  /{item.slug} · {item.published ? "published" : "draft"} ·{" "}
                  {item.publishedDate.slice(0, 10)} ·{" "}
                  {(item.content ?? []).length} blocks
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() => startEdit(item)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() => void togglePublish(item)}
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() => void onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </PaperCard>
        ))}
      </div>
    </Plate>
  );
}
