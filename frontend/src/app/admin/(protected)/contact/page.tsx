"use client";

import { FormEvent, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useLoadOnMount } from "@/hooks/useLoadOnMount";
import {
  Field,
  Plate,
  buttonClass,
  inputClass,
} from "@/components/admin/ui";

type ContactSettings = {
  id: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  contactFormEnabled: boolean;
  availabilityStatus?: string | null;
};

export default function AdminContactPage() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    location: "",
    availabilityStatus: "",
    contactFormEnabled: true,
  });
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const data = await api<ContactSettings | null>("/api/admin/contact/settings");
    if (!data) return;
    setForm({
      email: data.email,
      phone: data.phone ?? "",
      location: data.location ?? "",
      availabilityStatus: data.availabilityStatus ?? "",
      contactFormEnabled: data.contactFormEnabled,
    });
  }

  const { error, setError } = useLoadOnMount(load);
  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await api("/api/admin/contact/settings", {
        method: "PUT",
        body: {
          email: form.email,
          phone: form.phone || null,
          location: form.location || null,
          availabilityStatus: form.availabilityStatus || null,
          contactFormEnabled: form.contactFormEnabled,
        },
      });
      setMessage("Contact settings saved");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    }
  }

  return (
    <Plate label="FIG. A08 — CONTACT">
      <h1 className="text-3xl font-semibold tracking-tight">Contact settings</h1>
      <form onSubmit={(e) => void onSave(e)} className="mt-6 grid gap-3">
        <Field label="Email">
          <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        </Field>
        <Field label="Phone">
          <input className={inputClass} value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
        </Field>
        <Field label="Location">
          <input className={inputClass} value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
        </Field>
        <Field label="Availability status">
          <input className={inputClass} value={form.availabilityStatus} onChange={(e) => setForm((p) => ({ ...p, availabilityStatus: e.target.value }))} placeholder="Open to freelance work" />
        </Field>
        <label className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-xs">
          <input type="checkbox" checked={form.contactFormEnabled} onChange={(e) => setForm((p) => ({ ...p, contactFormEnabled: e.target.checked }))} />
          Contact form enabled
        </label>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? <p className="text-sm text-[var(--circuit-teal)]">{message}</p> : null}
        <button type="submit" className={buttonClass}>Save settings</button>
      </form>
    </Plate>
  );
}
