# Collaborative Task Manager (Full-Stack)

A production-ready full-stack Task Management application with authentication, task CRUD, real-time collaboration via Socket.io, and a responsive UI.

- Frontend: React (Vite, TypeScript) + Tailwind CSS + React Router + React Query + React Hook Form + Zod
- Backend: Node.js + Express (TypeScript) + Prisma + PostgreSQL + Socket.io
- Testing: Jest (backend unit tests)
- Deployment: Vercel/Netlify (FE) + Render/Railway (BE/DB)

## Monorepo Structure

- frontend/ — Vite React TS app
- backend/ — Express TS API with Prisma and Socket.io
- docker-compose.yml — Local stack with Postgres, API, and UI

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

## One-Command Local (Docker)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Postgres: port 5432 (internal), service `db`

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