# Personal CRM

## Agent Identity
See `/home/ashcrasl/enterpriseclaw/vibe-coder/CLAUDE.md` for Clu's full identity and rules.

## Project
- Personal CRM for Shawn to track people in his network
- Plan file: `/home/ashcrasl/.claude/plans/spicy-wishing-stearns.md`

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Drizzle ORM + Neon Postgres
- shadcn/ui + Tailwind CSS v4
- Vitest (unit) + Playwright (E2E) — BDD style
- Vercel for hosting, Vercel Blob for photos

## Commands
- `npm run dev` — start dev server
- `npx vitest` — run unit tests
- `npx playwright test` — run E2E tests
- `npx drizzle-kit push` — push schema to database
- `npx drizzle-kit studio` — browse database
