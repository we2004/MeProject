# ProjectFlow

ProjectFlow is a project-management application.

## Backend Overview

The backend is built with Node.js, Express, TypeScript, and SQLite. It provides a clean REST API separated from the React frontend.

### Technology Stack
- **Node.js + Express**: Web framework
- **TypeScript**: Static typing
- **SQLite**: Lightweight database (`database.sqlite` stored locally)
- **JSON Web Tokens (JWT)**: Authentication
- **Multer**: File uploads for attachments

### How to Run the Backend
1. Open a terminal and navigate to the `backend` directory:
   `cd backend`
2. Install dependencies:
   `npm install`
3. Start the development server (runs on port 3000):
   `npm run dev`

### Authentication & Modes
The backend provides two isolated modes to ensure demo data never mixes with real user data:

- **Explore Mode**: Call `POST /auth/explore` to receive a token for the isolated demo user. This user has seeded demo projects/tasks and resets its state automatically.
- **Account Mode**: Real accounts can be created via `POST /auth/register`. No email or phone is required. You will be provided with a **Recovery Key** which is the *only* way to recover the account if the password is lost.

### Authorization
Every resource (Project, Task, Note, Attachment) is tied to the authenticated user. Users cannot access or modify resources belonging to other users, even by guessing IDs. File downloads are also strictly protected.

### API Documentation
For full API details, endpoints, and request/response structures, see [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md).

*(Note: The backend was AI-generated as part of the project's learning and development process.)*
