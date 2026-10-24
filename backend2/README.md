# MeProject Backend 2 (PostgreSQL / Supabase)

`backend2` is the new PostgreSQL/Supabase version of the MeProject backend.

The original backend uses SQLite and is preserved unchanged in the `backend/` directory.
`backend2` replaces SQLite with a persistent Supabase PostgreSQL database while retaining 100% API compatibility with the existing frontend.

## Architecture

```text
Frontend
   ↓
Express API (backend2)
   ↓
PostgreSQL / Supabase
```

The application uses Express for routing, JWT for authentication, and `pg` for connecting to the PostgreSQL database.

## Technology Stack

- Node.js
- Express
- TypeScript
- PostgreSQL (`pg`)
- Supabase (for Database and Storage)
- JWT
- Multer

## Project Structure

- `src/` - Application source code
- `src/database/db.ts` - Centralized PostgreSQL connection pool
- `src/routes/` - Express route handlers
- `database/schema.sql` - PostgreSQL schema definition
- `scripts/migrate-sqlite-to-postgres.ts` - Script to migrate existing data from the old SQLite DB
- `.env.example` - Example environment variables

## Environment Variables

Copy `.env.example` to `.env` and fill in your details:

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your_jwt_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Local Development

1. Install dependencies if needed:
   ```bash
   npm install
   ```

2. Create `backend2/.env.development.local` using the existing `DATABASE_URL`,
   `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` values from `.env`. Set
   `NODE_ENV=development`, `PORT=3000`, and a separate development-only
   `JWT_SECRET`. Do not change `.env` or commit either environment file.

   This development configuration deliberately uses the existing Supabase
   database and Storage bucket. Local API activity therefore shares data with
   the deployed    application: records you create or edit, deletions of existing records, and
   uploaded files affect the same data and may remain or be visible in the
   deployed application. Use a test account and avoid destructive tests. Do not
   run the migration or demo seed scripts against this shared database.

3. Start the backend in this directory:
   ```powershell
   npm run dev
   ```

   The development script loads only `.env.development.local`; it does not fall
   back to `.env`. The separate development JWT secret keeps development login
   tokens distinct. Check that the server responds before starting the frontend:
   ```powershell
   Invoke-RestMethod http://localhost:3000/health
   ```

4. In another terminal, start the frontend:
   ```powershell
   Set-Location ..\frontend
   npm run dev -- --host 127.0.0.1
   ```

   Vite development mode loads `frontend/.env.development`, which directs API
   requests to `http://localhost:3000`. This file contains no credentials and
   is not used for production builds. Verify requests in
   browser developer tools under Network; their host should be `localhost:3000`,
   not the Cloud Run hostname.

5. Stop each server with `Ctrl+C` in its terminal. To return to the deployed
   configuration, stop the local servers and use the deployed Vercel site.
   The local overrides are only used by development commands; production builds
   and the existing `frontend/.env` and `backend2/.env` files remain unchanged.
   No feature changes need to be reverted.

## SQLite Migration

Do not run this migration against the shared Supabase database unless you
explicitly intend to copy the legacy SQLite records into it.

You can migrate data from the old `backend/database.sqlite` without modifying it.
Ensure the `.env` has a valid `DATABASE_URL`, then run the migration script:
`npx ts-node scripts/migrate-sqlite-to-postgres.ts`

The script connects to the old database (read-only), connects to your new PostgreSQL database, and safely transfers users, projects, tasks, notes, and attachment records, preserving IDs.

## File Attachments

In a Cloud Run environment, the local filesystem is ephemeral. We have implemented Supabase Storage for persistent file uploads.
When an attachment is uploaded, it is saved directly to your Supabase `attachments` bucket. 
Downloads stream the file from Supabase back to the user, ensuring API compatibility with the frontend (which expects to download files from `/attachments/:id/download`).

Make sure to create an `attachments` bucket in your Supabase Storage, and provide `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or anon key) in your `.env`.

## Cloud Run Deployment

1. Set the environment variables in your Cloud Run service (`PORT`, `DATABASE_URL`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
2. Build the Docker image (if using Docker) or rely on Cloud Build.
3. Deploy to Cloud Run.

## Frontend Compatibility

The API has been intentionally kept 100% compatible with the existing frontend. 
You can simply point your frontend to the `backend2` URL, and everything will continue working without any source code changes in the frontend. 
See `API_COMPATIBILITY.md` for a detailed breakdown.
