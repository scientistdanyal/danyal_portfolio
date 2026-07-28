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

type Experience = {
  id: string;
  organizationName: string;
  roleTitle: string;
  contractType: string;
  startDate: string;
  endDate?: string | null;
};

const CONTRACT_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "freelance",
  "internship",
] as const;

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState({
    organizationName: "",
    roleTitle: "",
    contractType: "full_time",
    startDate: "",
    endDate: "",
    location: "",
    techStack: "",
    problem: "",
    solution: "",
    impact: "",
  });
  async function load() {
    setItems(await api<Experience[]>("/api/admin/experience"));
  }

  const { error } = useLoadOnMount(load);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    await api("/api/admin/experience", {
      method: "POST",
      body: {
        ...form,
        endDate: form.endDate || null,
        location: form.location || null,
        impact: form.impact || null,
        techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      },
    });
    setForm({
      organizationName: "",
      roleTitle: "",
      contractType: "full_time",
      startDate: "",
      endDate: "",
      location: "",
      techStack: "",
      problem: "",
      solution: "",
      impact: "",
    });
    await load();
  }

  async function onDelete(id: string) {
    await api(`/api/admin/experience/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <Plate label="FIG. A06 — EXPERIENCE">
      <h1 className="text-3xl font-semibold tracking-tight">Experience</h1>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      <form onSubmit={(e) => void onCreate(e)} className="mt-6 grid gap-3 md:grid-cols-2">
        <Field label="Organization">
          <input className={inputClass} value={form.organizationName} onChange={(e) => setForm((p) => ({ ...p, organizationName: e.target.value }))} required />
        </Field>
        <Field label="Role">
          <input className={inputClass} value={form.roleTitle} onChange={(e) => setForm((p) => ({ ...p, roleTitle: e.target.value }))} required />
        </Field>
        <Field label="Contract type">
          <select className={inputClass} value={form.contractType} onChange={(e) => setForm((p) => ({ ...p, contractType: e.target.value }))}>
            {CONTRACT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input className={inputClass} value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
        </Field>
        <Field label="Start date">
          <input className={inputClass} type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} required />
        </Field>
        <Field label="End date">
          <input className={inputClass} type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
        </Field>
        <Field label="Tech stack (comma-separated)">
          <input className={`${inputClass} md:col-span-2`} value={form.techStack} onChange={(e) => setForm((p) => ({ ...p, techStack: e.target.value }))} required />
        </Field>
        <Field label="Problem">
          <textarea className={`${inputClass} min-h-20 md:col-span-2`} value={form.problem} onChange={(e) => setForm((p) => ({ ...p, problem: e.target.value }))} required />
        </Field>
        <Field label="Solution">
          <textarea className={`${inputClass} min-h-20 md:col-span-2`} value={form.solution} onChange={(e) => setForm((p) => ({ ...p, solution: e.target.value }))} required />
        </Field>
        <Field label="Impact">
          <textarea className={`${inputClass} min-h-20 md:col-span-2`} value={form.impact} onChange={(e) => setForm((p) => ({ ...p, impact: e.target.value }))} />
        </Field>
        <button type="submit" className={`${buttonClass} md:col-span-2`}>Add experience</button>
      </form>
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <PaperCard key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{item.roleTitle}</h2>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--ink)]/70">
                  {item.organizationName} · {item.contractType} · {item.startDate.slice(0, 10)}
                </p>
              </div>
              <button type="button" className={ghostButtonClass} onClick={() => void onDelete(item.id)}>Delete</button>
            </div>
          </PaperCard>
        ))}
      </div>
    </Plate>
  );
}
