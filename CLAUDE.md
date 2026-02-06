# SamirOS Terminal

Standalone PWA dashboard for monitoring all dev activity across projects. Terminal-style visual interface consuming the SamirOS API.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS with `pb-*` design tokens
- SWR for data fetching with automatic polling
- Zero database — thin client consuming PrintBliss-hosted API

## Architecture

```
Browser (PWA) --> /api/proxy/[...path] --> PrintBliss /api/os/*  --> Supabase
```

All data flows through the proxy route to avoid CORS. The proxy forwards to the PrintBliss deployment URL configured via `UPSTREAM_API_URL`.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main terminal dashboard (3-column grid) |
| `src/lib/api.ts` | API client with typed fetch wrappers |
| `src/lib/types.ts` | TypeScript interfaces for all data |
| `src/lib/hooks/*.ts` | SWR hooks with polling intervals |
| `src/app/api/proxy/[...path]/route.ts` | CORS proxy to PrintBliss |
| `public/manifest.json` | PWA manifest |

## Agentic Spine Governance

**Project slug:** `samir-os-terminal`
**Spine repo:** `~/Dropbox/DIGITALAPPARELPRINTING/GITHUB/agentic-spine`

### Session Lifecycle

```bash
cd ~/Dropbox/DIGITALAPPARELPRINTING/GITHUB/agentic-spine
./bin/cli/bin/spine session start --project samir-os-terminal
./bin/cli/bin/spine session status
./bin/cli/bin/spine session end --summary "..."
```

### Receipt Flow

All work tracked via spine. File receipts are canonical. Supabase is a queryable mirror.

### Query CLI

```bash
./ops/track/os-query.sh feed --project samir-os-terminal --limit 10
./ops/track/os-query.sh receipts --project samir-os-terminal
./ops/track/os-query.sh sessions
```
