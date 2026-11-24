# Working session: Order Exceptions Inbox

Ops managers at a B2B distributor handle about 200 order problems a day: late shipments, wrong items, price mismatches. Today they track them in a spreadsheet. Build the inbox they'll use instead.

The scope is bigger than 90 minutes on purpose. Choosing what to build first is part of the exercise. AI tools are allowed; we'll watch how you use them. Think out loud.

## Setup

```bash
bun install
bun run dev:web                      # http://localhost:3001
cd apps/web && bun run storybook     # http://localhost:6006
cd apps/web && bun run test          # Vitest + Testing Library
bun run check                        # Biome (via Ultracite)
```

## What's in the repo

| Part | Where |
|---|---|
| Inbox page | `apps/web/src/components/exceptions/` |
| Design tokens (color, spacing, radius, type) | `apps/web/src/index.css`, under "Product tokens". Use `bg-status-danger`, `p-page`, `rounded-surface`, `text-meta` and so on, not raw palette colors. |
| Base components (coss ui on Base UI) | `apps/web/src/components/ui/`. Docs: https://coss.com/ui/docs |
| Data model | `packages/api/src/exceptions/model.ts` |
| ~200 seeded exceptions | `packages/api/src/exceptions/store.ts`. In memory; restarting the server resets them. |
| Mock API | `packages/api/src/routers/exceptions.ts`. `exceptions.list`, `exceptions.update`, and the mock AI `ai.suggestAssignee`. Every call waits 300–1,200 ms and fails 10% of the time. |
| Role switcher | Header. `useRole()` from `apps/web/src/components/role-provider.tsx` |
| Stories | `*.stories.tsx` next to each component |

Call the API from the client with `orpc` from `apps/web/src/utils/orpc.ts`, for example `useQuery(orpc.exceptions.list.queryOptions())`.

## Part 1: Fix bugs (about 20 min)

Pick any two. For each one: reproduce it, explain the cause, fix it, and add a test.

1. "Escalated exceptions don't stand out. They look like medium-priority warnings, but escalations should read as danger."
2. "When I assign an exception with the keyboard, I lose my place. My focus ends up on a different exception."
3. "I clicked Resolve and the row said Resolved. Later it was open again, and nothing told me it hadn't worked."

## Part 2: Build (about 50 min)

A prioritized backlog. You won't finish it all.

1. List sorted by SLA due date, with status and priority filters saved in the URL.
2. Multi-select rows (including shift-click) with a bulk action bar: Assign, Escalate, Resolve.
3. Detail drawer with a workflow timeline (default, current, completed, and exception steps) built from the exception's history.
4. All states: loading skeleton, empty, error with retry, and partial bulk failure ("7 of 10 resolved, 3 failed: retry").
5. Permissions: Operators can't resolve high-priority items. The button is disabled and shows the reason.
6. AI suggestion in the drawer: shown as a proposal with Accept and Dismiss, never applied automatically, with undo after accepting.

New code should use the tokens and typed props, with a story for each new state.

## Part 3: Change request (about 15 min)

"Managers want a 'Needs approval' status. Operators can request it; only managers can approve."

Plan it first. Build as much as time allows.

## Part 4: Wrap-up (about 5 min)

What did you skip, and why? What would you do with another day?

## Within 24 hours

Send a one-page handoff note: what you built, what you left out, and what you'd do next.
