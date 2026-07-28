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

type Certification = {
  id: string;
  certificationName: string;
  organization: string;
  dateCompleted: string;
  credentialUrl?: string | null;
};

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [form, setForm] = useState({
    certificationName: "",
    organization: "",
    dateCompleted: "",
    credentialUrl: "",
  });
  async function load() {
    setItems(await api<Certification[]>("/api/admin/certifications"));
  }

  const { error } = useLoadOnMount(load);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    await api("/api/admin/certifications", {
      method: "POST",
      body: {
        ...form,
        credentialUrl: form.credentialUrl || null,
      },
    });
    setForm({
      certificationName: "",
      organization: "",
      dateCompleted: "",
      credentialUrl: "",
    });
    await load();
  }

  async function onDelete(id: string) {
    await api(`/api/admin/certifications/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <Plate label="FIG. A04 — CERTIFICATIONS">
      <h1 className="text-3xl font-semibold tracking-tight">Certifications</h1>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      <form onSubmit={(e) => void onCreate(e)} className="mt-6 grid gap-3 md:grid-cols-2">
        <Field label="Name">
          <input
            className={inputClass}
            value={form.certificationName}
            onChange={(e) => setForm((p) => ({ ...p, certificationName: e.target.value }))}
            required
          />
        </Field>
        <Field label="Organization">
          <input
            className={inputClass}
            value={form.organization}
            onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
            required
          />
        </Field>
        <Field label="Date completed">
          <input
            className={inputClass}
            type="date"
            value={form.dateCompleted}
            onChange={(e) => setForm((p) => ({ ...p, dateCompleted: e.target.value }))}
            required
          />
        </Field>
        <Field label="Credential URL">
          <input
            className={inputClass}
            type="url"
            value={form.credentialUrl}
            onChange={(e) => setForm((p) => ({ ...p, credentialUrl: e.target.value }))}
          />
        </Field>
        <button type="submit" className={`${buttonClass} md:col-span-2`}>
          Add certification
        </button>
      </form>
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <PaperCard key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{item.certificationName}</h2>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--ink)]/70">
                  {item.organization} · {item.dateCompleted.slice(0, 10)}
                </p>
              </div>
              <button
                type="button"
                className={ghostButtonClass}
                onClick={() => void onDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </PaperCard>
        ))}
      </div>
    </Plate>
  );
}
