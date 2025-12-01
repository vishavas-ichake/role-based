# Backend Developer Intern Assignment — Vishavas

## What it does
- REST API with JWT authentication & role-based access
- CRUD for Notes entity
- Frontend React app (simple UI) to test auth and CRUD

## Run locally
1. Copy `.env.example` to `.env` and fill secrets.
2. Start DB and backend:
   - Option A: Using Docker Compose: `docker-compose up --build`
   - Option B: Local MongoDB + `npm install` then `npm run dev`
3. Frontend: cd frontend && npm install && npm start

## Endpoints
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login => set HttpOnly cookies
- `POST /api/auth/refresh` — refresh access token
- `GET /api/notes` — list (protected)
- etc.

## Scalability note
(see SCALABILITY.md)
