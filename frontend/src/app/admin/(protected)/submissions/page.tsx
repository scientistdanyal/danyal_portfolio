"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useLoadOnMount } from "@/hooks/useLoadOnMount";
import {
  PaperCard,
  Plate,
  ghostButtonClass,
} from "@/components/admin/ui";

type Submission = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<Submission[]>([]);
  async function load() {
    setItems(await api<Submission[]>("/api/admin/contact/submissions"));
  }

  const { error } = useLoadOnMount(load);

  async function markRead(id: string, read: boolean) {
    await api(`/api/admin/contact/submissions/${id}`, {
      method: "PATCH",
      body: { read },
    });
    await load();
  }

  async function onDelete(id: string) {
    await api(`/api/admin/contact/submissions/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <Plate label="FIG. A09 — SUBMISSIONS">
      <h1 className="text-3xl font-semibold tracking-tight">Contact submissions</h1>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--paper)]/70">No submissions yet.</p>
        ) : null}
        {items.map((item) => (
          <PaperCard key={item.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">
                  {item.name}
                  {!item.read ? (
                    <span className="ml-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[var(--signal-amber)]">
                      NEW
                    </span>
                  ) : null}
                </h2>
                <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--ink)]/70">
                  {item.email} · {new Date(item.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 text-sm">{item.message}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={ghostButtonClass}
                  onClick={() => void markRead(item.id, !item.read)}
                >
                  {item.read ? "Mark unread" : "Mark read"}
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
