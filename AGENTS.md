<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LeadsLemonade landing page

Next.js 16 + React 19 + TypeScript + Tailwind 4. Backend in `backend/` (Express). Read `mem.md` and `mem_part2.md` only when the task touches business logic or copy.

## Commands
- `npm ci`
- `npm run lint` — must pass
- `npm run build` — must pass
- No test suite yet. Do not add one unless the issue asks.

## Rules for autonomous runs
- Work only on the issue given. No drive-by refactors.
- Do not edit `.github/**`, `AGENTS.md`, or test files.
- Do not commit or push; the runner does that.
- Finish with a 5-line summary: what changed, how verified, what is left.
- If the issue lacks clear acceptance criteria, stop and write `NEEDS_SPEC: <what is missing>` as your final line.
