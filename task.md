# Task: Deploy Vue/Express/Postgres via Vercel, Render, and Supabase

## 1. Project Context
* **Frontend:** Vue.js (Vite) to be hosted on **Vercel**.
* **Backend:** Express.js (Node.js) to be hosted on **Render**.
* **Database:** Managed Postgres on **Supabase**.
* **ORM:** Prisma.

## 2. Objective
Configure the project for a split deployment. No Docker or VM management required.

## 3. Deployment Requirements
### Phase 1: Database (Supabase)
* Provision a new Postgres project on Supabase.
* Provide the `DATABASE_URL` (Transaction Mode) to the Backend.

### Phase 2: Backend (Render)
* Configure Render to deploy from the `/backend` subdirectory of the GitHub repo.
* Set Environment Variables: `DATABASE_URL` (from Supabase) and `PORT=10000`.
* Ensure `npx prisma migrate deploy` runs during the Build Command.

### Phase 3: Frontend (Vercel)
* Connect the GitHub repo to Vercel and set the root directory to `/frontend`.
* Set Environment Variable: `VITE_API_URL` (pointing to the Render URL).

## 4. Security
* **CORS:** Enable CORS in the Express app specifically for the Vercel domain.