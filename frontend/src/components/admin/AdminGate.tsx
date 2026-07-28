"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getMe, type AdminUser } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((res) => {
        if (!cancelled) setUser(res.user);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 401) {
            router.replace("/admin/login");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="blueprint-grid flex min-h-screen items-center justify-center text-[var(--blueprint-line)]">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs tracking-widest">
          CHECKING SESSION…
        </p>
      </div>
    );
  }

  if (!user) return null;

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
