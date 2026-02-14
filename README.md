# Todo App (Monorepo) ✅

A simple full-stack Todo application built as a monorepo using Bun, TypeScript, Prisma (SQLite), and Vite + React.

---

## Table of contents

- [Overview](#overview)
- [Stack](#stack)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Environment](#environment)
  - [Run (development)](#run-development)
- [Project structure](#project-structure)
- [Backend](#backend)
  - [Database & Prisma](#database--prisma)
  - [Scripts](#scripts)
- [Web (frontend)](#web-frontend)
- [Shared](#shared)
- [API overview](#api-overview)
- [Contributing](#contributing)
- [Notes](#notes)

---

## Overview

This repository contains a Todo application split into three packages:

- `@todo/backend` – Express API using Bun and Prisma.
- `@todo/web` – Vite + React (TypeScript) frontend.
- `@todo/shared` – Shared Zod schemas and types used by both backend and frontend.

The monorepo is configured using Bun workspaces (root `package.json` with `packages/*`).

---

## Stack

- Runtime: Bun
- Backend: Express, Prisma, Zod, JSON Web Tokens
- Database: SQLite (via Prisma)
- Frontend: React + TypeScript, Vite, Tailwind, Zustand
- Shared validation: Zod

---

## Getting started

### Prerequisites

- Bun (https://bun.sh)
- Node tools if needed for editors (TypeScript, etc.)

### Install

From the repository root:

```bash
bun install
```

This installs dependencies for the workspace packages.

### Environment

Create a `.env` for the backend (see `packages/backend/.env.example` if present). Typical variables:

- `DATABASE_URL` – SQLite or other supported Prisma connection string
- `JWT_SECRET` – secret used to sign authentication tokens

> Note: Check `packages/backend/libs/env.ts` for environment variables used by the server.

### Run (development)

You can run both backend and frontend in development mode from the root:

```bash
bun run dev
```

Or run individual packages directly:

```bash
bun --cwd packages/backend dev   # backend
bun --cwd packages/web dev       # frontend
```

---

## Project structure

Top-level packages:

- `packages/backend` – server source in `src/` (controllers, routes, middlewares, prisma schema in `prisma/`)
- `packages/web` – React app in `src/` and Vite configuration
- `packages/shared` – reusable schemas and types

See the monorepo layout in the repository root and inside `packages/`.

---

## Backend

- Entry: `packages/backend/src/server.ts`
- Routing & controllers: `controllers/` and `routes/`
- Authentication middleware: `middlewares/auth.middleware.ts`
- Prisma schema: `packages/backend/prisma/schema.prisma`

### Database & Prisma

To generate Prisma client and run migrations:

```bash
# from packages/backend
bun run prisma:generate
bun run prisma:migrate
bun run prisma:studio   # opens Prisma Studio (UI)
```

Migrations are stored in `packages/backend/prisma/migrations`.

### Scripts

- `bun --cwd packages/backend dev` — start backend in watch mode
- `bun --cwd packages/backend start` — start backend

---

## Web (frontend)

- Entry: `packages/web/src/main.tsx`
- Uses React, Tanstack Query, Zustand for state, and Tailwind for styling.

### Scripts

- `bun --cwd packages/web dev` — start Vite dev server
- `bun --cwd packages/web build` — build for production
- `bun --cwd packages/web preview` — preview production build

---

## Shared

`@todo/shared` contains Zod schemas and shared types to keep API contracts consistent between backend and frontend.

Use the package in other packages via the workspace import: `@todo/shared`.

---

## API overview

The backend exposes endpoints for authentication and todos. Key routes are defined in `packages/backend/src/routes`.

- `POST /auth/register` – register a new user
- `POST /auth/login` – login and receive auth token or cookie
- `GET /todos` – get user's todos
- `POST /todos` – create a new todo
- `PUT /todos/:id` – update a todo
- `DELETE /todos/:id` – delete a todo

(Exact route paths and payloads are implemented in `auth.routes.ts` and `todo.routes.ts` and validated by Zod schemas in `@todo/shared`.)

---

## Contributing

Contributions are welcome. Typical flow:

1. Fork the repo
2. Create a feature branch
3. Run and test changes locally (both backend and web)
4. Open a pull request describing your change

---

## Notes

- This README is a living document. Add repository-specific instructions such as CI, tests, or deployment details as they are added.
- If you add new environment variables, update this README and (optionally) add `.env.example` files to each package.
