"use client";

import { FormEvent, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { ContactSettings } from "@/lib/public-data";

export function ContactForm({ settings }: { settings: ContactSettings | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
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
    <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-8">
        {!enabled ? (
          <p className="text-sm text-[var(--fg-muted)]">
            The contact form is currently disabled. Email me directly instead.
          </p>
        ) : null}
        <label className="block">
          <span className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">Name</span>
          <input
            required
            disabled={!enabled || status === "sending"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border-b-2 border-[var(--border)] bg-transparent pb-3 text-lg outline-none transition focus:border-[var(--fg)] disabled:opacity-50"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">Email</span>
          <input
            required
            type="email"
            disabled={!enabled || status === "sending"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b-2 border-[var(--border)] bg-transparent pb-3 text-lg outline-none transition focus:border-[var(--fg)] disabled:opacity-50"
            placeholder="your@email.com"
          />
        </label>
        <label className="block">
          <span className="mono text-[11px] tracking-wider uppercase text-[var(--fg-muted)]">Message</span>
          <textarea
            required
            rows={5}
            disabled={!enabled || status === "sending"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full border-b-2 border-[var(--border)] bg-transparent pb-3 text-lg outline-none transition focus:border-[var(--fg)] disabled:opacity-50"
            placeholder="Tell me about your project..."
          />
        </label>
        {error ? <p className="text-sm text-[var(--error)]">{error}</p> : null}
        {status === "sent" ? (
          <p className="text-sm text-[var(--success)]">Message sent successfully!</p>
        ) : null}
        <button
          type="submit"
          disabled={!enabled || status === "sending"}
          className="btn-primary disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </form>

      <aside className="space-y-6">
        {settings?.availabilityStatus ? (
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                open ? "bg-[var(--accent)]" : "bg-[var(--border)]"
              }`}
              aria-hidden
            />
            <p className="text-sm font-medium">
              {settings.availabilityStatus}
            </p>
          </div>
        ) : null}
        {settings?.email ? (
          <div>
            <p className="mono text-[11px] uppercase text-[var(--fg-muted)]">Email</p>
            <a href={`mailto:${settings.email}`} className="mt-1 block text-lg font-medium hover:text-[var(--accent)]">
              {settings.email}
            </a>
          </div>
        ) : null}
        {settings?.phone ? (
          <div>
            <p className="mono text-[11px] uppercase text-[var(--fg-muted)]">Phone</p>
            <p className="mt-1 text-lg font-medium">{settings.phone}</p>
          </div>
        ) : null}
        {settings?.location ? (
          <div>
            <p className="mono text-[11px] uppercase text-[var(--fg-muted)]">Location</p>
            <p className="mt-1 text-lg font-medium">{settings.location}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
