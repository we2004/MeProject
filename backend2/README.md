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

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env` with your PostgreSQL database URL (from Supabase).

3. Setup the database schema:
   Run the SQL commands from `database/schema.sql` in your Supabase SQL Editor.

4. (Optional) Migrate SQLite data:
   ```bash
   npx ts-node scripts/migrate-sqlite-to-postgres.ts
   ```

5. Start the backend:
   ```bash
   npm run dev
   ```

## SQLite Migration

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
