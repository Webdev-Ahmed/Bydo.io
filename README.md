# Todo App (Monorepo)

A full-stack Todo application implemented as a Bun-based monorepo. This repository demonstrates a pragmatic, production-minded setup using Bun, TypeScript, Prisma (SQLite by default), Vite + React, Zod validation, and lightweight state management (Zustand).

Table of contents

- Overview
- Key features
- Tech stack
- Getting started
  - Prerequisites
  - Install
  - Environment variables
  - Run (development)
  - Build & preview
- Project structure (detailed)
- Backend (detailed)
  - Running the server
  - Database & Prisma
  - Auth and API design
- Web (frontend)
  - Running locally
  - Build notes
- Shared package
- Scripts & commands
- API overview (endpoints + example payloads)
- Environment examples
- Troubleshooting
- Contributing
- License & contacts

Overview

This monorepo contains three workspace packages:

- `@todo/backend` — Express HTTP API powered by Bun and Prisma (database access and migrations, authentication, controllers and routes).
- `@todo/web` — Vite + React frontend (TypeScript), Tailwind for styling, Zustand for client state.
- `@todo/shared` — Shared Zod schemas and TypeScript types used by both backend and frontend to keep contracts consistent.

Key features

- JWT-based authentication with cookie support
- CRUD for Todos, and related finance / reminder models
- Prisma migrations + generated client
- Shared validation using Zod
- Monorepo developer ergonomics via Bun workspaces

Tech stack

- Runtime: Bun
- Backend: Express, Prisma, Zod, JSON Web Tokens
- Database: SQLite (default) via Prisma (easy to switch to Postgres or MySQL)
- Frontend: React + TypeScript, Vite, Tailwind CSS, Zustand

Getting started

Prerequisites

- Bun (https://bun.sh) installed and available on PATH
- A Git client for cloning (optional)

Install

From repository root:

```bash
bun install
```

This installs dependencies across workspace packages.

Environment variables

Create a `.env` file inside `packages/backend/` (or set environment variables in your environment). Typical variables:

- `DATABASE_URL` — Prisma connection string. Example for SQLite: `file:./dev.db`
- `JWT_SECRET` — secret used to sign authentication tokens (choose a secure random string)
- `PORT` — backend port (default set in code if omitted)

Example `packages/backend/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="supersecret_change_me"
PORT=4000
```

Run (development)

Start both backend and frontend from the repo root (convenience script if configured):

```bash
bun run dev
```

Or run each package separately:

```bash
# Backend (watch mode)
bun --cwd packages/backend dev

# Frontend (Vite dev server)
bun --cwd packages/web dev
```

Build & preview

```bash
# Build frontend
bun --cwd packages/web build

# Preview built frontend
bun --cwd packages/web preview
```

Project structure (high-level)

- [packages/backend](packages/backend)
  - [src/server.ts](packages/backend/src/server.ts) — HTTP server entry
  - [src/controllers](packages/backend/src/controllers) — controllers by domain
  - [src/routes](packages/backend/src/routes) — route registration
  - [src/middlewares/auth.middleware.ts](packages/backend/src/middlewares/auth.middleware.ts) — auth guard
  - [prisma/schema.prisma](packages/backend/prisma/schema.prisma) — Prisma schema and models
  - [prisma/migrations](packages/backend/prisma/migrations) — migration history

- [packages/web](packages/web)
  - [src/main.tsx](packages/web/src/main.tsx) — frontend entry
  - [src/pages](packages/web/src/pages) — React pages
  - [src/components](packages/web/src/components) — UI and shared components

- [packages/shared](packages/shared)
  - [src/schemas](packages/shared/src/schemas) — Zod schemas for requests and responses
  - [src/types](packages/shared/src/types) — shared TypeScript types

Backend (detailed)

Server entry and configuration

The main server is at [packages/backend/src/server.ts](packages/backend/src/server.ts). It wires Express, route registration, middlewares, and global error handling.

Auth middleware and cookies

Authentication lives in [packages/backend/src/middlewares/auth.middleware.ts](packages/backend/src/middlewares/auth.middleware.ts). Tokens are signed with `JWT_SECRET` and can be returned as cookies or JSON depending on client needs.

Database & Prisma

Prisma is configured using `packages/backend/prisma/schema.prisma`. Generated Prisma client is output under `packages/backend/generated/prisma` (configured in project). Typical Prisma workflows:

```bash
# From packages/backend
bun run prisma:generate    # generate client
bun run prisma:migrate     # apply migrations
bun run prisma:studio      # open Prisma Studio
```

Notes:

- Migrations are stored in `packages/backend/prisma/migrations`.
- Switching to another DB requires updating `DATABASE_URL` and running a migration.

Auth and API design

- Authentication endpoints: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` (see routes in [packages/backend/src/routes/auth.routes.ts](packages/backend/src/routes/auth.routes.ts)).
- Protected endpoints use the auth middleware and require a valid JWT cookie or Authorization header.

Web (frontend)

Frontend entry is [packages/web/src/main.tsx](packages/web/src/main.tsx). The UI uses Tailwind and a small set of reusable components in [packages/web/src/components](packages/web/src/components).

Local development

```bash
bun --cwd packages/web dev
```

Build for production

```bash
bun --cwd packages/web build
bun --cwd packages/web preview
```

Shared

`@todo/shared` contains Zod schemas (validation) and shared TypeScript types. Use these to keep request/response formats consistent between backend and frontend.

Scripts & common commands

- Install dependencies: `bun install` (run at repo root)
- Start both: `bun run dev` (if configured)
- Backend dev: `bun --cwd packages/backend dev`
- Frontend dev: `bun --cwd packages/web dev`
- Generate Prisma client: `bun --cwd packages/backend run prisma:generate`
- Run migrations: `bun --cwd packages/backend run prisma:migrate`

API overview (endpoints & examples)

Authentication

- `POST /auth/register`
  - body: `{ "email": "user@example.com", "password": "strongpass" }`
  - response: created user (id, email) and an auth cookie or token

- `POST /auth/login`
  - body: `{ "email": "user@example.com", "password": "strongpass" }`
  - response: auth token / cookie

Todos (protected)

- `GET /todos` — returns array of todos for authenticated user
- `POST /todos` — create a todo
  - body example: `{ "title": "Buy groceries", "notes": "Milk, eggs", "dueDate": "2026-02-20" }`
- `PUT /todos/:id` — update a todo
- `DELETE /todos/:id` — delete a todo

For exact request/response shapes, consult the Zod schemas in [packages/shared/src/schemas](packages/shared/src/schemas).

Environment examples and tips

- Use a dedicated `.env` per environment (development, production).
- When using SQLite locally, the `DATABASE_URL` commonly looks like `file:./dev.db` and the file is stored under `packages/backend` unless otherwise configured.

Troubleshooting

- If Prisma client code is missing: run `bun --cwd packages/backend run prisma:generate`.
- If migrations fail: ensure `DATABASE_URL` is reachable and the DB file is writeable.
- If auth fails: confirm `JWT_SECRET` is set in environment and matches what clients expect.

Testing & QA

This repo does not include a test suite by default. Recommended next steps:

- Add unit tests for backend controllers (Jest or Bun test runner) and frontend components (Vitest).
- Add end-to-end tests with Playwright or Cypress for critical flows (auth, CRUD).

Contributing

Contributions are welcome. Typical flow:

1. Fork the repo
2. Create a feature branch
3. Run and test changes locally
4. Open a pull request describing your change and motivation

When contributing, prefer small, focused PRs that are easy to review.

Further work (ideas)

- CI workflow for linting, typechecking, tests, and publishing
- Docker Compose or simple environment for running the stack consistently
- Add seed scripts for demo data

Contact

If you need help or want to discuss architecture decisions, open an issue or reach out via the repository's issue tracker.

License

This project does not include a license file by default. Add a LICENSE file if you plan to open-source or share the repo publicly.
