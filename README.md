# NCLEXLab

NCLEXLab is an NCLEX-RN preparation product with three connected experiences:

- A public website that explains the product and guides students to study.
- A student workspace for questions, learning resources, schedules, and progress.
- An admin workspace for reviewing and managing learning content.

## Current milestone

The web app includes responsive visual previews for the public landing page, student workspace, and admin workspace. Dashboard data is illustrative. Authentication, access permissions, learning content, API behavior, and persistence are not connected yet.

The project uses the existing pnpm monorepo foundation: Next.js/React in `apps/web`, Express in `servers/api`, and shared UI/types packages. Follow `AGENTS.md`, `architecture.yaml`, and relevant guidance under `.agent/` before making implementation changes.

## Run locally

Requirements: Node.js 20.19 or newer and pnpm 11.19.

```text
pnpm install
pnpm run dev
```

Open the web app at the local address printed by Next.js. The first preview routes are:

- `/` — public landing page
- `/student` — student workspace preview
- `/admin` — admin workspace preview

Run `pnpm run projects`, `pnpm run graph`, and `pnpm run tasks` to inspect the workspace through its repository control plane. Use the repository validation commands after implementation work, as described in `AGENTS.md`.

## Product and design planning

The planning files and visual references are stored alongside this repository in the parent project folder. Only selected web-ready images are copied into `apps/web/public/images`; the reference-image collection itself is not part of this repository.
