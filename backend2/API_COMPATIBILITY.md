# API Compatibility Checklist

This document compares the old SQLite backend endpoints to the new `backend2` PostgreSQL endpoints. 
All endpoints are designed to maintain full compatibility with the existing frontend.

| Endpoint | Method | Old Behavior | New Behavior | Compatible | Notes |
|----------|--------|--------------|--------------|------------|-------|
| `/auth/register` | `POST` | Created user in SQLite | Creates user in Postgres | YES | Returns `recoveryKey` |
| `/auth/login` | `POST` | Validated SQLite user, returned JWT | Validated Postgres user, returned JWT | YES | |
| `/auth/explore` | `POST` | Grabbed demo user from SQLite | Grabs demo user from Postgres | YES | |
| `/auth/logout` | `POST` | Returned success message | Returns success message | YES | Handled client-side |
| `/auth/me` | `GET` | Returned user details from JWT | Returns user details from JWT | YES | |
| `/auth/me` | `PATCH` | Updated user name | Updates user name | YES | |
| `/auth/me` | `DELETE` | Deleted user and cascaded manually | Deletes user and cascades | YES | |
| `/auth/reset-password` | `POST` | Reset password using recoveryKey | Resets password using recoveryKey | YES | |
| `/projects` | `GET` | Listed projects with derivedStatus | Lists projects with derivedStatus | YES | JSON parsing works same |
| `/projects/:id` | `GET` | Got project details | Gets project details | YES | |
| `/projects` | `POST` | Created project | Creates project | YES | |
| `/projects/:id` | `PUT` | Updated project | Updates project | YES | |
| `/projects/:id` | `DELETE` | Deleted project + attachments | Deletes project + attachments | YES | Cascades and deletes from Supabase storage |
| `/projects/:id/attachments` | `GET` | Got project attachments | Gets project attachments | YES | |
| `/tasks` | `GET` | Listed tasks, pagination, sorting | Lists tasks, pagination, sorting | YES | Pagination and filters are preserved |
| `/tasks/:id` | `GET` | Got task | Gets task | YES | |
| `/tasks` | `POST` | Created task | Creates task | YES | |
| `/tasks/:id` | `PUT` | Updated task | Updates task | YES | |
| `/tasks/:id` | `DELETE` | Deleted task | Deleted task | YES | |
| `/tasks/:id/notes` | `GET` | Got notes for task | Gets notes for task | YES | |
| `/notes/:id` | `GET` | Got note | Gets note | YES | |
| `/notes` | `POST` | Created note | Creates note | YES | |
| `/notes/:id` | `PUT` | Updated note | Updates note | YES | |
| `/notes/:id` | `DELETE` | Deleted note | Deletes note | YES | |
| `/attachments/:id` | `GET` | Got attachment record | Gets attachment record | YES | |
| `/attachments` | `POST` | Uploaded file to local disk | Uploads file to Supabase Storage | YES | Frontend contract is unchanged. Returns ID and message. |
| `/attachments/:id/download` | `GET` | Downloaded local file | Streams file from Supabase Storage | YES | Uses `supabase.storage.download` and pipes to client. |
| `/attachments/:id` | `DELETE` | Deleted local file & record | Deletes Supabase file & record | YES | |

## Verification

All endpoints have been analyzed and verified to ensure:
- Request bodies match.
- URL Parameters match.
- Query string formats match.
- Response JSON structures match exactly.
- JWT authentication expectations are unchanged.

As a result, the frontend does not require any code changes to switch to `backend2`.
