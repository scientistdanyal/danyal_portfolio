"use client";

import { FormEvent, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { ContactSettings } from "@/lib/public-data";

export function ContactForm({ settings }: { settings: ContactSettings | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const enabled = settings?.contactFormEnabled !== false;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!enabled) return;
    setStatus("sending");
    setError(null);
    try {
      await api("/api/contact", {
        method: "POST",
        body: { name, email, message },
        public: true,
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not send message");
    }
  }

  const open =
    !!settings?.availabilityStatus &&
    /open|available|freelance/i.test(settings.availabilityStatus);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        {!enabled ? (
          <p className="text-sm text-[var(--paper)]/70">
            The contact form is currently disabled. Email me directly instead.
          </p>
        ) : null}
        <label className="block space-y-1.5">
          <span className="mono text-[10px] tracking-wider text-[var(--blueprint-line)]">
            NAME
          </span>
          <input
            required
            disabled={!enabled || status === "sending"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-[var(--blueprint-line)]/30 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--signal-amber)]"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="mono text-[10px] tracking-wider text-[var(--blueprint-line)]">
            EMAIL
          </span>
          <input
            required
            type="email"
            disabled={!enabled || status === "sending"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-[var(--blueprint-line)]/30 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--signal-amber)]"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="mono text-[10px] tracking-wider text-[var(--blueprint-line)]">
            MESSAGE
          </span>
          <textarea
            required
            rows={6}
            disabled={!enabled || status === "sending"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded border border-[var(--blueprint-line)]/30 bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--signal-amber)]"
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {status === "sent" ? (
          <p className="text-sm text-[var(--circuit-teal)]">Message sent.</p>
        ) : null}
        <button
          type="submit"
          disabled={!enabled || status === "sending"}
          className="rounded bg-[var(--signal-amber)] px-5 py-2.5 mono text-xs tracking-wider text-[var(--ink)] disabled:opacity-50"
        >
          {status === "sending" ? "SENDING…" : "SEND MESSAGE"}
        </button>
      </form>

      <aside className="space-y-4">
        {settings?.availabilityStatus ? (
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                open ? "bg-[var(--signal-amber)]" : "bg-[var(--paper)]/30"
              }`}
              aria-hidden
            />
            <p className="mono text-xs text-[var(--paper)]/80">
              {settings.availabilityStatus}
            </p>
          </div>
        ) : null}
        {settings?.email ? (
          <p className="mono text-sm text-[var(--blueprint-line)]">
            {settings.email}
          </p>
        ) : null}
        {settings?.location ? (
          <p className="mono text-xs text-[var(--paper)]/60">{settings.location}</p>
        ) : null}
        {settings?.phone ? (
          <p className="mono text-xs text-[var(--paper)]/60">{settings.phone}</p>
        ) : null}
      </aside>
    </div>
  );
}
