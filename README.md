# Task Manager (Monorepo)

Full-stack task manager built with:
...
## Troubleshooting
- Backend port in use: stop other processes on 4000 or change `PORT`.
- Prisma errors in OneDrive: move repo out of OneDrive.
- CORS/auth: ensure `CORS_ORIGIN` matches your frontend URL.
Placeholder README.

Full-stack task manager built with:
- Frontend: Vite + React + TypeScript, Tailwind CSS, React Query, React Router, React Hook Form + Zod
- Backend: Node.js + Express (TypeScript), Prisma, Socket.io, JWT auth (HttpOnly cookies)
- Database: SQLite for local dev; Postgres recommended for production

## Project Structure

```
Task manager/
├─ frontend/                 # React app (Vite)
│  ├─ src/                   # Pages, components, api clients, hooks
│  ├─ package.json
│  └─ vite.config.ts
├─ backend/                  # Express API (TypeScript)
│  ├─ src/                   # Controllers, services, repositories, middleware
│  ├─ prisma/                # Prisma schemas & migrations (SQLite dev)
│  ├─ tests/                 # Jest unit tests (optional)
│  ├─ package.json
│  └─ tsconfig.json
└─ README.md
```

## Prerequisites
- Node.js 20+
- npm

## Local Development

Backend (SQLite dev mode):
```powershell
cd "C:\Users\HP\OneDrive\Desktop\Task manager\backend"
npm install
npm run prisma:generate:sqlite
npm run prisma:migrate:sqlite
npm run dev
```

Frontend:
```powershell
cd "C:\Users\HP\OneDrive\Desktop\Task manager\frontend"
npm install
npm run dev
```

App URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000 (health: /api/v1/health)

Notes:
- OneDrive may lock Prisma binaries; if you see EPERM errors, move the project to a non-OneDrive folder (e.g., `C:\Projects\TaskManager`).

## Environment Variables

Backend:
- `JWT_SECRET` (required): any long random string
- `CORS_ORIGIN` (required): frontend URL (default `http://localhost:5173`)
- `DATABASE_URL` (optional for Postgres)

Frontend:
- `VITE_API_URL` (optional): backend base URL (defaults to `http://localhost:4000`)

## Testing (optional)
Run backend unit tests:
```powershell
cd "C:\Users\HP\OneDrive\Desktop\Task manager\backend"
npm test
```

## Deployment

Recommended free-friendly setup:
- Frontend: Netlify or Vercel
- Backend: Render (Web Service)

Backend (Render):
- Build: `npm install && npm run prisma:generate:sqlite && npm run build`
- Start: `npm run start`
- Env: `JWT_SECRET`, `CORS_ORIGIN` (set to your frontend URL)

Frontend (Netlify):
- The repository is configured with `netlify.toml` for easy deployment
- Build: `npm install && npm run build` (configured automatically)
- Publish directory: `frontend/dist` (configured automatically)
- Env: `VITE_API_URL` set to your Render backend URL
- Deploy: Connect your GitHub repo to Netlify, it will auto-detect the configuration

Frontend (Vercel):
- Build: `npm run build`
- Output: `dist`
- Root Directory: `frontend`
- Env: `VITE_API_URL` set to your Render backend URL

For persistence, provision Postgres and set `DATABASE_URL`, then switch Prisma to use `schema.prisma` and run migrations.

## Features
- Register/Login with JWT in HttpOnly cookies
- Create, assign, update, delete tasks
- Real-time notifications and updates via Socket.io
- Dashboard with Assigned, Created, and Overdue sections
- Form validation with Zod
- Polished UI with Tailwind and reusable components

## Troubleshooting
- Backend port in use: stop other processes on 4000 or change `PORT`.
- Prisma engine EPERM on OneDrive: move repo out of OneDrive.
- CORS/auth: ensure `CORS_ORIGIN` matches your frontend URL.
# Collaborative Task Manager (Full-Stack)

A production-ready full-stack Task Management application with authentication, task CRUD, real-time collaboration via Socket.io, and a responsive UI.

- Frontend: React (Vite, TypeScript) + Tailwind CSS + React Router + React Query + React Hook Form + Zod
- Backend: Node.js + Express (TypeScript) + Prisma + PostgreSQL + Socket.io
- Testing: Jest (backend unit tests)
- Deployment: Vercel/Netlify (FE) + Render/Railway (BE/DB)

## Monorepo Structure

- frontend/ — Vite React TS app
- backend/ — Express TS API with Prisma and Socket.io

## Why PostgreSQL + Prisma

PostgreSQL provides strong relational guarantees and native enum support ideal for tasks with statuses/priorities and relations between `User`, `Task`, and `Notification`. Prisma offers type-safe queries, clean migrations, and excellent DX.

## Quick Start (Local)

1) Requirements
- Node.js 18+ and npm
- Docker (for one-command local stack) or Postgres locally

2) Environment
Copy backend env template and fill values:

```bash
cd backend
cp .env.example .env
# set DATABASE_URL (e.g. to docker compose URL), JWT_SECRET, CORS origins
```

3) Install deps

```bash
cd backend && npm install
cd ../frontend && npm install
```

4) DB setup

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

5) Run locally (two terminals)

```bash
# Terminal 1 (API)
cd backend
npm run dev

# Terminal 2 (FE)
cd frontend
npm run dev
```

API default: http://localhost:4000  
Frontend default: http://localhost:5173

Cookies are HttpOnly; ensure same-site/cors set per your hostnames.



## API Contract (v1)

- POST /api/v1/auth/register — body: {email, name, password}
- POST /api/v1/auth/login — body: {email, password}
- POST /api/v1/auth/logout
- GET  /api/v1/auth/me
- PATCH /api/v1/users/me — body: {name}

- GET    /api/v1/tasks?status=...&priority=...&sort=dueDate:asc|desc
- POST   /api/v1/tasks — body: CreateTaskDto
- GET    /api/v1/tasks/:id
- PATCH  /api/v1/tasks/:id — body: UpdateTaskDto
- DELETE /api/v1/tasks/:id

- GET  /api/v1/notifications
- POST /api/v1/notifications/:id/read

DTOs validated via Zod; meaningful HTTP errors returned.

## Real-Time (Socket.io)

- Server authenticates sockets via JWT from HttpOnly cookie.
- Users join `user:<id>` rooms.
- Emits:
  - `task.updated` (broadcast) when status/priority/assignee changes
  - `notification.assigned` (to assignee) on new assignment

Frontend subscribes and refreshes React Query caches, showing persistent in-app notifications.

## Frontend UX

- Mobile-first responsive layout with Tailwind
- React Query for caching + loading skeletons
- React Hook Form + Zod for forms
- Dashboard: assigned to me, created by me, overdue
- Tasks list: filter by status/priority, sort by due date

## Testing

Backend has Jest unit tests for critical business logic:
- Task creation constraints (title length)
- Assignment creates notification + emits event
- Auth hashing/verification logic

Run tests:

```bash
cd backend
npm test
```

## Deployment

- FE: Vercel/Netlify — set `VITE_API_URL` to your API URL, enable cookies/credentials.
- BE: Render/Railway — set env vars (`DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `COOKIE_SECURE`, etc.).
- DB: Render/Railway Postgres; update `DATABASE_URL` and run `prisma migrate deploy`.

## Design Decisions

- Clear layering: Controllers → Services → Repositories (Prisma)
- DTO validation (Zod) at the edges
- JWT in HttpOnly cookie for session security
- Socket.io for real-time collaboration with user rooms
- Prisma enums for `Priority` and `Status`

## Assumptions & Trade-offs

- Basic notification model (read/unread) for assignment events
- Cookie-based auth for web clients; token-based could be added for API clients
- Minimal audit logs recorded on status changes (optional extension)

## License

For assessment purposes only; no license provided.