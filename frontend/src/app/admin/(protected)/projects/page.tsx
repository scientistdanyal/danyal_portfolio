"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useLoadOnMount } from "@/hooks/useLoadOnMount";
import {
  Field,
  PaperCard,
  Plate,
  buttonClass,
  ghostButtonClass,
  inputClass,
} from "@/components/admin/ui";

type Project = {
  id: string;
  projectName: string;
  tagline: string;
  coverImage: string;
  techStack: string[];
  featured: boolean;
  url?: string | null;
  client?: string | null;
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState({
    projectName: "",
    tagline: "",
    coverImage: "",
    techStack: "",
    featured: false,
    url: "",
    client: "",
    overview: "",
  });
  async function load() {
    setItems(await api<Project[]>("/api/admin/projects"));
  }

  const { error } = useLoadOnMount(load);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    await api("/api/admin/projects", {
      method: "POST",
      body: {
        projectName: form.projectName,
        tagline: form.tagline,
        coverImage: form.coverImage,
        techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
        featured: form.featured,
        url: form.url || null,
        client: form.client || null,
        caseStudy: form.overview
          ? { overview: form.overview }
          : undefined,
      },
    });
    setForm({
      projectName: "",
      tagline: "",
      coverImage: "",
      techStack: "",
      featured: false,
      url: "",
      client: "",
      overview: "",
    });
    await load();
  }

  async function onDelete(id: string) {
    await api(`/api/admin/projects/${id}`, { method: "DELETE" });
    await load();
  }

  async function toggleFeatured(project: Project) {
    await api(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      body: { featured: !project.featured },
    });
    await load();
  }

  return (
    <Plate label="FIG. A05 — PROJECTS">
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      <form onSubmit={(e) => void onCreate(e)} className="mt-6 grid gap-3">
        <Field label="Project name">
          <input className={inputClass} value={form.projectName} onChange={(e) => setForm((p) => ({ ...p, projectName: e.target.value }))} required />
        </Field>
        <Field label="Tagline">
          <input className={inputClass} value={form.tagline} onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} required />
        </Field>
        <Field label="Cover image URL">
          <input className={inputClass} value={form.coverImage} onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))} required />
        </Field>
        <Field label="Tech stack (comma-separated)">
          <input className={inputClass} value={form.techStack} onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))} required />
        </Field>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Live URL">
            <input className={inputClass} type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} />
          </Field>
          <Field label="Client">
            <input className={inputClass} value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))} />
          </Field>
        </div>
        <Field label="Case study overview">
          <textarea className={`${inputClass} min-h-24`} value={form.overview} onChange={(e) => setForm((p) => ({ ...p, overview: e.target.value }))} />
        </Field>
        <label className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-xs">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
          />
          Featured on homepage
        </label>
        <button type="submit" className={buttonClass}>Add project</button>
      </form>
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <PaperCard key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{item.projectName}</h2>
                <p className="text-sm text-[var(--ink)]/70">{item.tagline}</p>
                <p className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[10px]">
                  {item.techStack.join(" · ")}
                  {item.featured ? " · FEATURED" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" className={ghostButtonClass} onClick={() => void toggleFeatured(item)}>
                  {item.featured ? "Unfeature" : "Feature"}
                </button>
                <button type="button" className={ghostButtonClass} onClick={() => void onDelete(item.id)}>
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
