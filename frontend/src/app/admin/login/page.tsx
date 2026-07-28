"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { Field, buttonClass, inputClass } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@engineerdanyal.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="blueprint-grid flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="w-full max-w-md rounded bg-[var(--paper)] p-8 text-[var(--ink)] shadow-sm"
      >
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-widest text-[var(--circuit-teal)]">
          FIG. A — ACCESS
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Admin login</h1>
        <p className="mt-2 text-sm text-[var(--ink)]/70">
          Single-operator access for engineerdanyal.com content.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="EMAIL">
            <input
              className={`${inputClass} !bg-white !text-[var(--ink)]`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </Field>
          <Field label="PASSWORD">
            <input
              className={`${inputClass} !bg-white !text-[var(--ink)]`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="current-password"
            />
          </Field>
        </div>

        {error ? (
          <p className="mt-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-red-600">
            {error}
          </p>
        ) : null}

        <button type="submit" className={`${buttonClass} mt-6 w-full`} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
