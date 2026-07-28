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
      <p className="text-sm text-[var(--paper)]/70">No experience listed yet.</p>
    );
  }

  return (
    <ol className="relative space-y-0 md:pl-0">
      {items.map((item, index) => {
        const open = openId === item.id;
        const end = item.endDate ? formatDate(item.endDate) : "Present";
        return (
          <li
            key={item.id}
            className="grid gap-3 border-l border-[var(--blueprint-line)]/40 py-5 pl-5 md:grid-cols-[140px_1fr] md:gap-8 md:border-l-0 md:pl-0"
          >
            <div className="mono text-xs text-[var(--blueprint-line)] md:pt-1">
              <span className="md:hidden">
                {formatDate(item.startDate)} — {end}
              </span>
              <span className="relative hidden md:block">
                <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full border border-[var(--blueprint-line)] bg-[var(--blueprint-navy)]" />
                {index < items.length - 1 ? (
                  <span className="absolute -left-[1.05rem] top-4 h-[calc(100%+1.25rem)] w-px bg-[var(--blueprint-line)]/40" />
                ) : null}
                {formatDate(item.startDate)}
                <br />
                {end}
              </span>
            </div>
            <div>
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
              >
                <h3 className="text-xl font-semibold tracking-tight">
                  {item.roleTitle}
                </h3>
                <p className="mt-1 text-sm text-[var(--paper)]/75">
                  {item.organizationName}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                <span className="mt-2 inline-block mono rounded border border-[var(--blueprint-line)]/40 px-2 py-0.5 text-[10px] text-[var(--blueprint-line)]">
                  {formatContract(item.contractType)}
                </span>
              </button>

              {(open || compact) && (
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--paper)]/80">
                  {!compact ? (
                    <>
                      <p>
                        <span className="mono text-[10px] text-[var(--signal-amber)]">
                          PROBLEM
                        </span>
                        <br />
                        {item.problem}
                      </p>
                      <p>
                        <span className="mono text-[10px] text-[var(--signal-amber)]">
                          SOLUTION
                        </span>
                        <br />
                        {item.solution}
                      </p>
                      {item.impact ? (
                        <p>
                          <span className="mono text-[10px] text-[var(--signal-amber)]">
                            IMPACT
                          </span>
                          <br />
                          {item.impact}
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p>{item.solution}</p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="tag mono rounded px-2 py-0.5 text-[10px]"
                      >
                        {tech}
                      </span>
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
