# Portfolio Website — Sections Specification

This document defines the data schema and content structure for each section of the portfolio site. Intended for use by a build/dev agent to scaffold pages, components, and data models.

---

## 1. Portfolio (Home / About)

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | ✅ | Full display name |
| title | string | ✅ | e.g. "Full-Stack Developer" |
| image | url/file | ✅ | Profile photo |
| short_description | string | ✅ | 1–2 line tagline / hero summary |
| long_description | text | ✅ | About-me paragraph(s) |
| location | string | ✅ | City, Country |
| education | array of objects | ✅ | See below |
| experience_summary | array of objects | ✅ | See Section 4 (linked/reused) |
| projects_summary | array of objects | ✅ | Featured/highlighted projects only (see Section 3) |
| social_links | array of objects | optional | { platform, url } |
| resume_url | url | optional | Downloadable CV/resume |

**education (object)**
| Field | Type | Required |
|---|---|---|
| institution | string | ✅ |
| degree | string | ✅ |
| field_of_study | string | optional |
| start_date | date | ✅ |
| end_date | date | optional (blank/"Present" if ongoing) |
| description | string | optional |

---

## 2. Skills & Certifications

### 2.1 Technology Skills

Organized by **category** (e.g. Frontend, Backend, DevOps, Mobile, Databases, Cloud, Design, etc.)

| Field | Type | Required | Notes |
|---|---|---|---|
| category | string | ✅ | e.g. "Frontend" |
| skills | array of objects | ✅ | See below |

**skill (object)**
| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | ✅ | Language/framework/tool name |
| type | enum | ✅ | `language` \| `framework` \| `tool` |
| proficiency | enum or number | ✅ | e.g. Beginner/Intermediate/Advanced/Expert, or 1–100 |
| icon | url/file | optional | Logo/icon for UI display |

### 2.2 Certifications

| Field | Type | Required | Notes |
|---|---|---|---|
| certification_name | string | ✅ | |
| organization | string | ✅ | Issuing body |
| date_completed | date | ✅ | |
| credential_url | url | optional | Verification link |
| image | url/file | optional | Certificate badge/image |

---

## 3. Projects / Case Studies

| Field | Type | Required | Notes |
|---|---|---|---|
| project_name | string | ✅ | |
| url | url | optional | Live demo / repo link |
| tagline | string | ✅ | Short 2-line description for card view |
| client | string | optional | Client/company name |
| cover_image | url/file | ✅ | Thumbnail for project card |
| tech_stack | array of strings | ✅ | Technologies used |
| featured | boolean | optional | Highlight on homepage |
| case_study_details | object | optional | Populates modal / detail view |

**case_study_details (object)** — shown in modal/expanded view
| Field | Type | Required |
|---|---|---|
| overview | text | ✅ |
| problem_statement | text | optional |
| solution | text | optional |
| role | string | optional |
| duration | string | optional |
| screenshots | array of url/file | optional |
| results_impact | text | optional |

---

## 4. Experience

| Field | Type | Required | Notes |
|---|---|---|---|
| organization_name | string | ✅ | |
| role_title | string | ✅ | Job title/role |
| contract_type | enum | ✅ | `Full-time` \| `Part-time` \| `Contract` \| `Freelance` \| `Internship` |
| start_date | date | ✅ | |
| end_date | date | optional | Blank/"Present" if current |
| location | string | optional | Remote / city |
| tech_stack | array of strings | ✅ | |
| problem | text | ✅ | Challenge/context faced |
| solution | text | ✅ | What was built/done |
| impact | text | optional | Measurable outcome/result |
| logo | url/file | optional | Organization logo |

---

## 5. Blogs

| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | ✅ | |
| slug | string | ✅ | URL-friendly identifier |
| abstract | string | ✅ | Short teaser for listing page |
| summary | text | ✅ | Full write-up / body content |
| cover_image | url/file | optional | |
| images | array of url/file | optional | Inline images within post |
| code_section | object | optional | { language, code } — supports syntax highlighting |
| tags | array of strings | optional | Topic tags for filtering |
| published_date | date | ✅ | |
| read_time | string | optional | e.g. "5 min read" |
| cateogory | string
---

## 6. Contact

| Field | Type | Required | Notes |
|---|---|---|---|
| email | string | ✅ | |
| phone | string | optional | |
| location | string | optional | General location (not full address) |
| social_links | array of objects | optional | { platform, url } |
| contact_form | boolean | optional | Whether to render a functional contact form |
| form_fields | array of strings | optional (if form enabled) | e.g. name, email, message |
| availability_status | string | optional | e.g. "Open to freelance work" |

---

## Notes for the Build Agent

- All `optional` fields should degrade gracefully in the UI (hide element if empty, don't render blank space).
- `image`/`url/file` fields should support both an uploaded file path and an external URL.
- Sections 3 and 4 feed into Section 1's summary/featured views — reuse the same data models rather than duplicating schemas.
- Consider a shared `date` format (ISO 8601: `YYYY-MM-DD`) across all sections for consistency.
- `case_study_details` and any modal-based content should lazy-load to keep initial page weight low.