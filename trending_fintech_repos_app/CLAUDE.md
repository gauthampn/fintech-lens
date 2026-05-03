# CLAUDE.md — FinTech Lens

> This file is read by Claude Code at the start of every task.
> It provides project context, constraints, and conventions so the agent
> makes correct decisions without needing to ask clarifying questions.
> Keep this file up to date as the project evolves.

---

## Project overview

**Name:** FinTech Lens
**Purpose:** Surface the top trending public GitHub repositories at the
intersection of FinTech and Agentic AI. Each repo is scored on stars,
recency, and topic relevance. In Sprint 2, a Claude-powered agent will
generate a deeper use-case analysis per repo.

**Live URL:** (add Vercel URL after first deploy)
**GitHub repo:** (add URL after init)
**Current sprint:** Sprint 1 — static GitHub API fetch + UI

---

## Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Use server components by default |
| Language | TypeScript (strict mode) | No `any` types — ever |
| Styling | Tailwind CSS + shadcn/ui | Use shadcn components before building custom |
| Data fetching | GitHub REST API v3 | Public endpoints, no auth in Sprint 1 |
| Database | None in Sprint 1 | Supabase added in Sprint 2 |
| Deployment | Vercel | Auto-deploys on push to `main` |
| Package manager | pnpm | Use `pnpm` not `npm` or `yarn` |

---

## Repository structure

```
fintech-lens/
├── app/
│   ├── page.tsx          # Main page — repo grid + filters
│   ├── layout.tsx        # Root layout
│   └── api/
│       └── repos/
│           └── route.ts  # GitHub API fetch route
├── components/
│   ├── RepoCard.tsx      # Single repo card
│   ├── FilterBar.tsx     # All | FinTech | Agentic AI | Both
│   └── SortControl.tsx   # Stars | Recent Activity
├── lib/
│   ├── github.ts         # GitHub API client + fetch logic
│   └── scoring.ts        # Relevance scoring logic
├── types/
│   └── repo.ts           # Repo interface (source of truth — see below)
├── CLAUDE.md             # ← you are here
└── .env.local            # GITHUB_TOKEN (optional, raises rate limit)
```

---

## Canonical data model

**This is the source of truth. Do not rename or remove fields without
updating every component that references them.**

```typescript
// types/repo.ts
export interface Repo {
  id: number;
  name: string;
  full_name: string;       // e.g. "owner/repo-name"
  html_url: string;        // link to GitHub
  description: string;     // shown as 2-line summary on card
  stargazers_count: number;
  language: string | null;
  pushed_at: string;       // ISO 8601 — used for activity badge
  topics: string[];        // GitHub topic tags
  relevance: "FinTech" | "Agentic AI" | "Both"; // computed in scoring.ts
}

// Sprint 2 — add this field to Repo when Claude agent is wired:
// ai_summary?: string;    // Claude-generated 2-sentence use-case analysis
// ai_score?: number;      // 0–100 composite score from Claude agent
```

---

## GitHub API queries

Fetch from these three endpoints and deduplicate by `id`:

```
GET https://api.github.com/search/repositories
  ?q=topic:fintech+topic:llm+language:english
  &sort=stars&order=desc&per_page=10

GET https://api.github.com/search/repositories
  ?q=topic:fintech+topic:ai-agent+language:english
  &sort=stars&order=desc&per_page=10

GET https://api.github.com/search/repositories
  ?q=topic:payments+topic:langchain+language:english
  &sort=stars&order=desc&per_page=10
```

**Rate limits:** 60 req/hr unauthenticated, 5000/hr with `GITHUB_TOKEN`.
Cache responses for 10 minutes using Next.js `revalidate`.

---

## Scoring logic (lib/scoring.ts)

```typescript
// Activity badge
export function getActivityBadge(pushed_at: string): "Active" | "Stale" {
  const daysSincePush = (Date.now() - new Date(pushed_at).getTime())
    / (1000 * 60 * 60 * 24);
  return daysSincePush <= 90 ? "Active" : "Stale";
}

// Star badge tier
export function getStarBadge(stars: number): string {
  if (stars >= 10000) return "10k+";
  if (stars >= 1000)  return `${Math.floor(stars / 1000)}k+`;
  if (stars >= 100)   return "100+";
  return String(stars);
}

// Relevance — computed from topics array
export function getRelevance(topics: string[]): Repo["relevance"] {
  const isFintech = topics.some(t =>
    ["fintech","payments","banking","finance"].includes(t));
  const isAI = topics.some(t =>
    ["llm","ai-agent","langchain","openai","claude","rag"].includes(t));
  if (isFintech && isAI) return "Both";
  if (isAI) return "Agentic AI";
  return "FinTech";
}
```

---

## UI conventions

- **Color palette:** Monochrome only — white bg, black text, `#e5e5e5` borders
- **Badges:** muted tones only — no bright colors
  - Stars: amber-50 bg, amber-700 text
  - Active: green-50 bg, green-700 text
  - Stale: gray-100 bg, gray-500 text
  - FinTech: blue-50 bg, blue-700 text
  - Agentic AI: purple-50 bg, purple-700 text
  - Both: indigo-50 bg, indigo-700 text
- **Card:** `border border-gray-200 rounded-xl p-5 bg-white`
- **Grid:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **Font:** Geist Sans (already in Next.js 14 default)
- **No shadows** except `shadow-sm` on card hover

---

## What NOT to do

Claude Code must never do the following without explicit human approval:

- [ ] Add a database or ORM in Sprint 1
- [ ] Add authentication (no login required)
- [ ] Use `npm` or `yarn` — always use `pnpm`
- [ ] Add any color outside the monochrome palette
- [ ] Use `any` TypeScript type
- [ ] Commit directly to `main` — always create a feature branch
- [ ] Add paid APIs or services
- [ ] Remove the `language:english` filter from GitHub queries
- [ ] Rename fields in the `Repo` interface without a migration plan

---

## Git workflow (follow this exactly)

```bash
# Start a new feature
git checkout -b feat/short-description

# Commit convention (Conventional Commits)
git commit -m "feat: add language filter to GitHub query"
git commit -m "fix: deduplicate repos across three API queries"
git commit -m "chore: update CLAUDE.md with Sprint 2 data model"

# Open PR — title matches commit, body links the GitHub Issue
# e.g. "Closes #12"
```

Branch naming: `feat/`, `fix/`, `chore/`, `refactor/`

---

## Sprint roadmap (PM context for the agent)

| Sprint | Goal | Status |
|---|---|---|
| 1 | GitHub API fetch + card UI + filters | 🟡 In progress |
| 2 | Claude scoring agent + README analysis | ⬜ Not started |
| 3 | Claude Code CLI workflows + MCP GitHub | ⬜ Not started |
| 4 | PRD v2 features + full PM lifecycle | ⬜ Not started |

---

## Known issues / backlog (update as you work)

- [ ] #1 — Third-party repos returning non-English descriptions (fix: `language:english` query param)
- [ ] #2 — Star counts appear mocked in v0.dev — wire real GitHub API
- [ ] #3 — "Analyze with AI" button needs hover state + loading spinner
- [ ] #4 — No empty state when filters return zero results

---

## Environment variables

```bash
# .env.local — never commit this file
GITHUB_TOKEN=         # Optional. Raises API rate limit from 60 to 5000/hr
ANTHROPIC_API_KEY=    # Sprint 2 only — Claude scoring agent
```

---

## How to run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build check before PR
pnpm lint         # must pass before every commit
```

---

*Last updated: Sprint 1 · Update this file at the start of every sprint.*
