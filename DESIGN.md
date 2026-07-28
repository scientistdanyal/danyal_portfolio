# Design Specification — engineerdanyal.com

Companion to `sections.md` (content schema) and `instructions.md` (build/architecture). This file defines the visual identity, layout system, and interaction rules for the build agent to implement.

**Subject**: a full-stack engineer's portfolio (Next.js/React, Node/Express/Prisma stack, Section 5 in `instructions.md`).
**Audience**: recruiters, hiring managers, and potential freelance/contract clients evaluating credibility quickly.
**Page's single job**: prove engineering competence fast — real projects, real stack, real experience — without reading like a templated SaaS/agency landing page.

Note: I looked at a reference site (`flow-design-agency.webflow.io`) during scoping — it's a generic agency-template look (rounded cards, soft shadows, stock "process steps," JotForm popouts). We're deliberately **not** copying that aesthetic; it reads interchangeable with thousands of other Webflow sites. This spec goes a different direction: grounded in what an engineer's actual working materials look like.

---

## 1. Design Concept: "Engineering Blueprint"

Rather than a generic dark-mode-with-neon-accent or cream-and-serif portfolio look, the site borrows from **technical drafting/blueprint documents** — the artifact an engineer actually produces. Sections are framed like drawing plates (`FIG. 01`, `FIG. 02`...) because the content genuinely is a structured technical record (experience timeline, project specs, skill inventory) — not numbering for decoration.

### Color Palette

| Token | Hex | Use |
|---|---|---|
| `--blueprint-navy` | `#0E2A4A` | Primary dark background (hero, section dividers) |
| `--blueprint-line` | `#8FCFEA` | Grid lines, hairline rules, annotation leader-lines |
| `--paper` | `#F4F6F5` | Light content-card background (project/blog cards) |
| `--ink` | `#16232E` | Primary text on light backgrounds |
| `--signal-amber` | `#F2A93B` | CTAs, active/hover states, key highlights |
| `--circuit-teal` | `#2FBBA6` | Tags, skill-proficiency indicators, success states |

Avoid: warm cream + terracotta (overused default), pure black + neon green (overused default). This palette's navy/cyan pairing is literal blueprint-paper coloring, which is the point.

### Typography

| Role | Typeface | Notes |
|---|---|---|
| Display (H1/H2) | **Space Grotesk** | Geometric, technical-drawing feel; used at large size, tight tracking |
| Body | **Inter** | High readability at small sizes, used for descriptions/paragraphs |
| Utility/mono | **JetBrains Mono** | Tech stack tags, dates, plate labels ("FIG. 03"), code snippets, proficiency percentages |

The monospace face is doing real work here, not decoration: it's used everywhere the content is literally technical metadata (stack names, dates, version-like labels), reinforcing the blueprint concept.

### Layout Concept

- Base grid: a faint `--blueprint-line` dot/line grid sits behind dark sections (like blueprint paper), at low opacity (~8%), fixed, non-distracting.
- Content sits in a centered 1200px max-width column, 12-col grid underneath.
- Each major section is a "plate": a small mono-font label in the top-left corner (`FIG. 01 — EXPERIENCE`) plus a thin horizontal rule, echoing a drawing's title block.
- Cards (projects, blogs, certifications) are **light paper rectangles** dropped onto the dark blueprint background — a deliberate figure/ground contrast, like a printed spec sheet pinned to a drafting board.

```
┌───────────────────────────────────────────┐
│ [blueprint-navy bg, faint grid]            │
│  FIG. 01 — PORTFOLIO            ─────────  │
│                                              │
│   Name (display, huge)                      │
│   role / tagline (mono, amber)              │
│   [photo — annotated with a leader-line     │
│    label like a technical figure]           │
└───────────────────────────────────────────┘
```

### Signature Element

The **hero draws itself in**: on load, a thin SVG line traces out a simple schematic — connecting three annotated nodes labeled `SKILLS → BUILD → SHIP` (or similar, real words TBD) — like a circuit trace completing, using `stroke-dashoffset` animation. It runs once, respects `prefers-reduced-motion` (shows fully drawn, no animation, if set), and is the one deliberate motion moment on the page. Everything else stays calm: simple fades/slide-ins on scroll, no scroll-jacking, no parallax.

---

## 2. Page-by-Page Layout

### 2.1 Portfolio (Home)

```
FIG. 01 — PORTFOLIO
┌─────────────────────────────────────────────┐
│  [Name — huge display]                       │
│  [role/tagline — mono, amber]                │
│  [photo, annotated w/ leader-line: "based in │
│   {location}"]                                │
│  [CTA: View Work] [CTA: Download Résumé]     │
└─────────────────────────────────────────────┘

FIG. 02 — ABOUT
  short_description / long_description (2-col:
  text left, education timeline right, mono dates)

FIG. 03 — SELECTED WORK (3 featured project cards,
  paper cards on navy bg, "View all projects →")

FIG. 04 — EXPERIENCE (compact timeline preview,
  "View full history →")
```

### 2.2 Skills & Certifications

```
FIG. 05 — SKILLS
  Tabbed or stacked category groups (Frontend /
  Backend / DevOps / ...). Each skill = mono name +
  proficiency bar in --circuit-teal, not a percentage
  badge (bars read faster, feel more "instrument panel").

FIG. 06 — CERTIFICATIONS
  Grid of paper cards: badge image, cert name,
  issuing org (mono), date, "Verify →" if url exists.
```

### 2.3 Projects / Case Studies

```
FIG. 07 — PROJECTS
  Grid of paper cards: cover_image, project_name,
  tagline (2 lines), tech_stack as mono pill tags,
  client name if present (small, muted).
  Click → modal:
    ┌─────────────────────────────┐
    │ overview / problem / solution │
    │ screenshots (carousel)        │
    │ role, duration, results       │
    │ [Visit live site →]           │
    └─────────────────────────────┘
```

### 2.4 Experience

```
FIG. 08 — EXPERIENCE
  Vertical timeline, left rail = mono dates + a thin
  --blueprint-line connecting nodes (literal timeline,
  numbering/chronology is real information here).
  Each node expands: org, role, contract_type badge,
  tech_stack tags, problem → solution → impact.
```

### 2.5 Blogs

```
FIG. 09 — BLOGS
  List view (not grid) — abstract-first, since blogs
  are read linearly: title, abstract, published_date
  (mono), read_time, tags.
  Post page: summary body, inline images, code_section
  rendered in a monospace block with syntax highlight,
  matching the blueprint mono aesthetic already
  established (no separate "dev blog theme" needed).
```

### 2.6 Contact

```
FIG. 10 — CONTACT
  Simple, no popup form service (unlike the reference
  site's JotForm redirect) — a native form matching
  the rest of the design: name, email, message.
  Direct email + location shown in mono under the form.
  availability_status shown as a small status dot +
  label (amber if open, muted if not) — reads like an
  instrument indicator, fits the concept.
```

---

## 3. Interaction & Motion Rules

- One orchestrated moment: the hero line-draw animation. Everything else is quiet.
- Scroll reveals: simple opacity/translateY(12px) fade-ins, 200–300ms, no bounce/elastic easing.
- Hover states: paper cards lift 2–4px with a soft shadow; tags/pills shift from outline to filled `--circuit-teal`.
- Respect `prefers-reduced-motion`: disable the line-draw and scroll reveals, show final states directly.
- Keyboard focus: visible focus ring in `--signal-amber`, 2px offset, on every interactive element.

## 4. Content Voice

- Plain, direct, first person ("I built...", not "This platform enables..."). No agency-style filler ("pixel-perfect," "seamlessly," "wizard").
- Project taglines describe what the thing does and for whom, not adjectives about quality.
- Empty states (e.g. no blogs published yet) get a short, plain sentence — no personality-heavy copy.

## 5. Responsive Notes

- Blueprint grid background scales down to a subtler, lower-opacity pattern on mobile (avoid visual noise on small screens).
- Timeline (Experience) collapses to a single-column stacked list on mobile, dates move above each entry instead of in a side rail.
- Project modal becomes a full-screen sheet on mobile rather than a centered dialog.