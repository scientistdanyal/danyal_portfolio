"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { mediaUrl } from "@/lib/api";
import { formatCodeWithPrettier, detectCodeLanguage } from "@/lib/format-code";

export type StoryBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; alt?: string }
  | { id: string; type: "code"; language: string; code: string };

function uid() {
  return `b_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyStory(): StoryBlock[] {
  return [{ id: uid(), type: "paragraph", text: "" }];
}

type SelectionSnap = {
  blockId: string;
  start: number;
  end: number;
};

type Props = {
  blocks: StoryBlock[];
  onChange: (blocks: StoryBlock[]) => void;
};

function wrapSelection(
  text: string,
  start: number,
  end: number,
  wrapper: string,
) {
  const selected = text.slice(start, end) || "text";
  const next = `${text.slice(0, start)}${wrapper}${selected}${wrapper}${text.slice(end)}`;
  const cursor = start + wrapper.length + selected.length + wrapper.length;
  return { next, cursor };
}

export function StoryEditor({ blocks, onChange }: Props) {
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [imageUrlPanel, setImageUrlPanel] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [formattingId, setFormattingId] = useState<string | null>(null);
  const [formatNote, setFormatNote] = useState<string | null>(null);
  const selectionRef = useRef<SelectionSnap | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && root.contains(e.target)) return;
      setMenuFor(null);
      setImageUrlPanel(null);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  function rememberSelection(blockId: string, el: HTMLTextAreaElement) {
    selectionRef.current = {
      blockId,
      start: el.selectionStart,
      end: el.selectionEnd,
    };
  }

  function updateBlock(id: string, patch: Partial<StoryBlock>) {
    onChange(
      blocks.map((block) =>
        block.id === id ? ({ ...block, ...patch } as StoryBlock) : block,
      ),
    );
  }

  function insertAfter(afterId: string, block: StoryBlock) {
    const index = blocks.findIndex((b) => b.id === afterId);
    if (index === -1) {
      onChange([...blocks, block]);
      return;
    }
    const next = [...blocks];
    next.splice(index + 1, 0, block);
    onChange(next);
  }

  function removeBlock(id: string) {
    if (blocks.length === 1) {
      onChange(emptyStory());
      return;
    }
    onChange(blocks.filter((b) => b.id !== id));
  }

  function applyInlineFormat(blockId: string, wrapper: "**" | "*") {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || block.type !== "paragraph") {
      setMenuFor(null);
      return;
    }

    const snap = selectionRef.current;
    const start =
      snap && snap.blockId === blockId ? snap.start : block.text.length;
    const end = snap && snap.blockId === blockId ? snap.end : block.text.length;
    const { next, cursor } = wrapSelection(block.text, start, end, wrapper);
    updateBlock(blockId, { text: next });
    setMenuFor(null);

    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLTextAreaElement>(
        `textarea[data-block-id="${blockId}"]`,
      );
      if (!el) return;
      el.focus();
      el.setSelectionRange(cursor, cursor);
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    });
  }

  function addCodeSnippet(afterId: string) {
    insertAfter(afterId, {
      id: uid(),
      type: "code",
      language: "typescript",
      code: "",
    });
    setMenuFor(null);
    setImageUrlPanel(null);
  }

  function openImageUrl(afterId: string) {
    setMenuFor(null);
    setImageUrl("");
    setImageUrlPanel(afterId);
  }

  function submitImageUrl(afterId: string) {
    const url = imageUrl.trim();
    if (!url) return;
    insertAfter(afterId, { id: uid(), type: "image", url, alt: "" });
    setImageUrl("");
    setImageUrlPanel(null);
    setMenuFor(null);
  }

  async function formatCodeBlock(blockId: string) {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || block.type !== "code" || !block.code.trim()) return;

    setFormattingId(blockId);
    setFormatNote(null);
    try {
      const result = await formatCodeWithPrettier(block.code, block.language);
      updateBlock(blockId, {
        code: result.code,
        language: result.language,
      });
      setFormatNote(
        result.formatted
          ? `Formatted as ${result.language}`
          : (result.note ?? null),
      );
    } finally {
      setFormattingId(null);
    }
  }

  function openInsertMenu(blockId: string) {
    const el = document.querySelector<HTMLTextAreaElement>(
      `textarea[data-block-id="${blockId}"]`,
    );
    if (el) rememberSelection(blockId, el);
    setImageUrlPanel(null);
    setMenuFor((current) => (current === blockId ? null : blockId));
  }

  function onParagraphKeyDown(
    e: ReactKeyboardEvent<HTMLTextAreaElement>,
    block: Extract<StoryBlock, { type: "paragraph" }>,
  ) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      rememberSelection(block.id, e.currentTarget);
      applyInlineFormat(block.id, "**");
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      rememberSelection(block.id, e.currentTarget);
      applyInlineFormat(block.id, "*");
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newBlock: StoryBlock = { id: uid(), type: "paragraph", text: "" };
      insertAfter(block.id, newBlock);
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLTextAreaElement>(
            `textarea[data-block-id="${newBlock.id}"]`,
          )
          ?.focus();
      });
    }
    if (e.key === "Backspace" && block.text === "" && blocks.length > 1) {
      e.preventDefault();
      const index = blocks.findIndex((b) => b.id === block.id);
      removeBlock(block.id);
      const prev = blocks[index - 1];
      if (prev?.type === "paragraph") {
        requestAnimationFrame(() => {
          document
            .querySelector<HTMLTextAreaElement>(
              `textarea[data-block-id="${prev.id}"]`,
            )
            ?.focus();
        });
      }
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <div className="space-y-1">
        {blocks.map((block) => {
          const controlsOpen =
            menuFor === block.id || imageUrlPanel === block.id;

          return (
            <div
              key={block.id}
              className={`group relative pl-12 ${controlsOpen ? "z-30" : "z-0"}`}
            >
              <div
                className={`absolute left-0 top-0 z-40 ${
                  controlsOpen
                    ? "pointer-events-auto opacity-100"
                    : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
                }`}
              >
                <button
                  type="button"
                  aria-label="Format and insert"
                  aria-expanded={controlsOpen}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openInsertMenu(block.id);
                  }}
                  className="mt-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ink)]/25 bg-[var(--paper)] text-lg leading-none text-[var(--ink)]/70 shadow-sm hover:border-[var(--ink)]/60 hover:text-[var(--ink)]"
                >
                  +
                </button>

                {menuFor === block.id ? (
                  <div
                    role="menu"
                    className="absolute left-0 top-11 z-50 min-w-[190px] rounded-md border border-[var(--ink)]/10 bg-white py-1 shadow-xl"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--ink)] hover:bg-[var(--ink)]/5"
                      onClick={() => applyInlineFormat(block.id, "**")}
                    >
                      <span className="w-4 font-bold">B</span> Bold
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[var(--ink)] hover:bg-[var(--ink)]/5"
                      onClick={() => applyInlineFormat(block.id, "*")}
                    >
                      <span className="w-4 italic">I</span> Italic
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full px-3 py-2.5 text-left text-sm text-[var(--ink)] hover:bg-[var(--ink)]/5"
                      onClick={() => openImageUrl(block.id)}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full px-3 py-2.5 text-left text-sm text-[var(--ink)] hover:bg-[var(--ink)]/5"
                      onClick={() => addCodeSnippet(block.id)}
                    >
                      Code snippet
                    </button>
                  </div>
                ) : null}

                {imageUrlPanel === block.id ? (
                  <div
                    className="absolute left-0 top-11 z-50 w-72 rounded-md border border-[var(--ink)]/10 bg-white p-3 shadow-xl"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <p className="mb-2 text-xs text-[var(--ink)]/60">
                      Paste image URL
                    </p>
                    <input
                      autoFocus
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          submitImageUrl(block.id);
                        }
                        if (e.key === "Escape") {
                          setImageUrlPanel(null);
                        }
                      }}
                      placeholder="https://…"
                      className="mb-2 w-full rounded border border-[var(--ink)]/15 px-2 py-1.5 text-sm outline-none focus:border-[var(--signal-amber)]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded bg-[var(--ink)] px-3 py-1.5 text-xs text-white"
                        onClick={() => submitImageUrl(block.id)}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="rounded px-3 py-1.5 text-xs text-[var(--ink)]/60"
                        onClick={() => setImageUrlPanel(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {block.type === "paragraph" ? (
                <textarea
                  data-block-id={block.id}
                  value={block.text}
                  placeholder="Tell your story…"
                  rows={1}
                  onSelect={(e) =>
                    rememberSelection(block.id, e.currentTarget)
                  }
                  onKeyUp={(e) => rememberSelection(block.id, e.currentTarget)}
                  onMouseUp={(e) =>
                    rememberSelection(block.id, e.currentTarget)
                  }
                  onChange={(e) => {
                    updateBlock(block.id, { text: e.target.value });
                    rememberSelection(block.id, e.currentTarget);
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onFocus={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => onParagraphKeyDown(e, block)}
                  className="w-full resize-none border-0 bg-transparent py-2 text-lg leading-relaxed text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/30"
                />
              ) : null}

              {block.type === "image" ? (
                <div className="relative my-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(block.url) ?? block.url}
                    alt={block.alt ?? ""}
                    className="mx-auto max-h-[480px] w-full object-contain"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={block.url}
                      onChange={(e) =>
                        updateBlock(block.id, { url: e.target.value })
                      }
                      placeholder="Image URL"
                      className="flex-1 border-0 border-b border-[var(--ink)]/15 bg-transparent py-1 text-sm text-[var(--ink)]/70 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-[var(--ink)]/50 hover:text-red-600"
                    >
                      REMOVE
                    </button>
                  </div>
                  <input
                    value={block.alt ?? ""}
                    onChange={(e) =>
                      updateBlock(block.id, { alt: e.target.value })
                    }
                    placeholder="Caption (optional)"
                    className="mt-2 w-full border-0 bg-transparent py-1 text-center text-sm text-[var(--ink)]/50 outline-none"
                  />
                </div>
              ) : null}

              {block.type === "code" ? (
                <div className="my-4 overflow-hidden rounded border border-[var(--ink)]/10 bg-[var(--ink)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
                    <input
                      value={block.language}
                      onChange={(e) =>
                        updateBlock(block.id, { language: e.target.value })
                      }
                      className="w-40 border-0 bg-transparent font-[family-name:var(--font-jetbrains-mono)] text-xs text-[var(--circuit-teal)] outline-none"
                      placeholder="language (auto)"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={formattingId === block.id || !block.code.trim()}
                        onClick={() => void formatCodeBlock(block.id)}
                        className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] tracking-wider text-[var(--signal-amber)] hover:underline disabled:opacity-40"
                      >
                        {formattingId === block.id
                          ? "FORMATTING…"
                          : "FORMAT (PRETTIER)"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-white/50 hover:text-white"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={block.code}
                    onChange={(e) => {
                      setFormatNote(null);
                      updateBlock(block.id, { code: e.target.value });
                    }}
                    onBlur={() => {
                      if (!block.code.trim()) return;
                      const current = block.language.trim().toLowerCase();
                      if (
                        current &&
                        current !== "typescript" &&
                        current !== "plaintext" &&
                        current !== "text"
                      ) {
                        return;
                      }
                      const detected = detectCodeLanguage(block.code);
                      if (detected && detected !== current) {
                        updateBlock(block.id, { language: detected });
                      }
                    }}
                    spellCheck={false}
                    placeholder="// paste code, then click Format (Prettier)"
                    className="min-h-40 w-full resize-y border-0 bg-transparent p-4 font-[family-name:var(--font-jetbrains-mono)] text-sm leading-relaxed text-[var(--blueprint-line)] outline-none"
                  />
                  {formatNote && formattingId === null ? (
                    <p className="border-t border-white/10 px-3 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[10px] text-white/50">
                      {formatNote}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
