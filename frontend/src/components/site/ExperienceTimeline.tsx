"use client";

import { useState } from "react";
import type { Experience } from "@/lib/public-data";
import { formatContract, formatDate } from "@/lib/public-data";

export function ExperienceTimeline({
  items,
  compact = false,
}: {
  items: Experience[];
  compact?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--fg-muted)]">No experience listed yet.</p>
    );
  }

  return (
    <ol className="space-y-0">
      {items.map((item, index) => {
        const open = openId === item.id;
        const end = item.endDate ? formatDate(item.endDate) : "Present";
        return (
          <li
            key={item.id}
            className="grid gap-4 border-b border-[var(--border)] py-8 first:pt-0 last:border-b-0 md:grid-cols-[180px_1fr] md:gap-10"
          >
            <div>
              <span className="mono text-3xl font-bold text-[var(--bg-alt)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mono mt-2 text-[11px] text-[var(--fg-muted)]">
                {formatDate(item.startDate)} — {end}
              </p>
            </div>
            <div>
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
              >
                <h3 className="text-xl font-bold tracking-tight">
                  {item.roleTitle}
                </h3>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">
                  {item.organizationName}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                <span className="tag mt-2 inline-block">
                  {formatContract(item.contractType)}
                </span>
              </button>

              {(open || compact) && (
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--fg)]/80">
                  {!compact ? (
                    <>
                      {item.problem ? (
                        <div>
                          <span className="mono text-[10px] font-semibold uppercase text-[var(--accent)]">Problem</span>
                          <p className="mt-1">{item.problem}</p>
                        </div>
                      ) : null}
                      {item.solution ? (
                        <div>
                          <span className="mono text-[10px] font-semibold uppercase text-[var(--accent)]">Solution</span>
                          <p className="mt-1">{item.solution}</p>
                        </div>
                      ) : null}
                      {item.impact ? (
                        <div>
                          <span className="mono text-[10px] font-semibold uppercase text-[var(--accent)]">Impact</span>
                          <p className="mt-1">{item.impact}</p>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <p>{item.solution}</p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.techStack.map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
