"use client";

import { FormEvent, useState } from "react";
import { API_BASE, api, ApiError, mediaUrl } from "@/lib/api";
import { useLoadOnMount } from "@/hooks/useLoadOnMount";
import {
  Field,
  Plate,
  buttonClass,
  ghostButtonClass,
  inputClass,
} from "@/components/admin/ui";

type Profile = {
  id: string;
  name: string;
  title: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  location: string;
  resumeUrl?: string | null;
};

const empty = {
  name: "",
  title: "",
  image: "",
  shortDescription: "",
  longDescription: "",
  location: "",
  resumeUrl: "",
};

export default function AdminProfilePage() {
  const [form, setForm] = useState(empty);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const data = await api<Profile | null>("/api/admin/profile");
    if (!data) return;
    setProfileId(data.id);
    setForm({
      name: data.name,
      title: data.title,
      image: data.image,
      shortDescription: data.shortDescription,
      longDescription: data.longDescription,
      location: data.location,
      resumeUrl: data.resumeUrl ?? "",
    });
  }

  const { error, setError } = useLoadOnMount(load);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        image: form.image.trim(),
        shortDescription: form.shortDescription.trim(),
        longDescription: form.longDescription.trim(),
        location: form.location.trim(),
        resumeUrl: form.resumeUrl.trim() ? form.resumeUrl.trim() : null,
      };
      const saved = profileId
        ? await api<Profile>(`/api/admin/profile/${profileId}`, {
            method: "PATCH",
            body: payload,
          })
        : await api<Profile>("/api/admin/profile", {
            method: "POST",
            body: payload,
          });
      setProfileId(saved.id);
      setMessage("Profile saved");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function onUploadPhoto(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    setMessage(null);
    const fd = new FormData();
    fd.append("image", file);
    try {
      if (profileId) {
        const res = await api<{ image: string }>("/api/admin/uploads/profile-image", {
          method: "POST",
          formData: fd,
        });
        setForm((prev) => ({ ...prev, image: res.image ?? "" }));
      } else {
        const res = await api<{ url: string }>("/api/admin/uploads/image", {
          method: "POST",
          formData: fd,
        });
        setForm((prev) => ({ ...prev, image: res.url ?? "" }));
      }
      setMessage("Photo uploaded — click Save profile if needed");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Photo upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onUploadResume(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    setMessage(null);
    const fd = new FormData();
    fd.append("resume", file);
    try {
      const res = await api<{ resumeUrl: string }>("/api/admin/uploads/resume", {
        method: "POST",
        formData: fd,
      });
      setForm((prev) => ({ ...prev, resumeUrl: res.resumeUrl ?? "" }));
      setMessage("Resume uploaded");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const photoSrc = mediaUrl(form.image);

  return (
    <Plate label="FIG. A02 — PROFILE">
      <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
      <form onSubmit={(e) => void onSave(e)} className="mt-6 grid gap-4">
        {(
          [
            ["name", "Name"],
            ["title", "Title"],
            ["location", "Location"],
            ["shortDescription", "Short description"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <input
              className={inputClass}
              value={form[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              required
            />
          </Field>
        ))}

        <Field label="Long description">
          <textarea
            className={`${inputClass} min-h-32`}
            value={form.longDescription}
            onChange={(e) =>
              setForm((p) => ({ ...p, longDescription: e.target.value }))
            }
            required
          />
        </Field>

        <div className="space-y-3 rounded border border-[var(--blueprint-line)]/25 p-4">
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-widest text-[var(--blueprint-line)]">
            PROFILE PHOTO
          </p>
          <Field label="Image path / URL">
            <input
              className={inputClass}
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="/uploads/images/profile.jpeg"
              required
            />
          </Field>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={uploading}
            onChange={(e) => void onUploadPhoto(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-[var(--paper)]/80"
          />
          {photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoSrc}
              alt=""
              className="mt-2 h-32 w-32 object-cover border border-[var(--blueprint-line)]/30"
            />
          ) : null}
        </div>

        <div className="space-y-3 rounded border border-[var(--blueprint-line)]/25 p-4">
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-widest text-[var(--blueprint-line)]">
            RESUME
          </p>
          <Field label="Resume path / URL">
            <input
              className={inputClass}
              value={form.resumeUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, resumeUrl: e.target.value }))
              }
              placeholder="/uploads/resume/resume.pdf"
            />
          </Field>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            disabled={uploading}
            onChange={(e) => void onUploadResume(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-[var(--paper)]/80"
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {message ? (
          <p className="text-sm text-[var(--circuit-teal)]">{message}</p>
        ) : null}
        {uploading ? (
          <p className="text-xs text-[var(--blueprint-line)]">Uploading…</p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className={buttonClass} disabled={loading || uploading}>
            {loading ? "Saving…" : "Save profile"}
          </button>
          {form.resumeUrl ? (
            <a
              href={
                form.resumeUrl.startsWith("http")
                  ? form.resumeUrl
                  : `${API_BASE}${form.resumeUrl}`
              }
              target="_blank"
              rel="noreferrer"
              className={ghostButtonClass}
            >
              View resume
            </a>
          ) : null}
        </div>
      </form>
    </Plate>
  );
}
