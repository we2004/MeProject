# MeProject

## Description

MeProject is personal project management application, it provides a simple workspace for creating and managing projects, tracking tasks, adding notes, and monitoring project progress.

## Live Demo

[View the live project](YOUR_LIVE_DEMO_URL)

## Features

* Create, update, and delete projects
* Create, update, and delete tasks
* Add and manage notes for tasks
* Add and manage attachments for projects
* Update task status
* Activate and cancel projects
* Filter tasks by status and priority
* Sort tasks by due date
* Paginate tasks
* View project progress based on task completion
* User registration and login
* Explore the application with demo data
* Change account name
* Change password using a recovery key
* Delete account
* Loading states with skeletons and spinners
* Error handling with error card displays
* Empty states for pages without data
* Responsive design
* Animated intro screen
* Social media preview metadata

## Technologies Used

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Day.js
* Lucide React
* Motion
* REST API
* JSON Web Tokens (JWT)
* Google Cloud Run

## Backend

The backend REST API used by this project was fully AI-generated.
My work on this project focused on the frontend application, including the UI, state management, API integration, authentication flow, reusable components, and overall frontend architecture.

For full API details, endpoints, and request/response structures, see [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md).

## Installation and Setup
### Backend

The backend REST API is included in this repository and was AI-generated.

Navigate to the backend folder:
cd backend
Install the backend dependencies:
npm install
Create a .env file based on .env.example and configure the required environment variables.
Start the backend development server:
npm run dev

Keep the backend running while using the frontend.

### Frontend
Open a new terminal and navigate to the frontend folder:
cd frontend
Install the frontend dependencies:
npm install
Create a .env file based on .env.example and configure the backend API URL:
VITE_BASE_URL=http://localhost:YOUR_BACKEND_PORT
Start the frontend development server:
npm run dev
Open the URL provided in the terminal, typically:
http://localhost:5173
Running the Full Application

Both the frontend and backend must be running at the same time.

Frontend
http://localhost:5173
        │
        │ API requests
        ▼
Backend
http://localhost:YOUR_BACKEND_PORT

The frontend communicates with the backend through the VITE_BASE_URL environment variable.

## Deployment

The application is deployed using **Google Cloud Run**.

The project is connected to its GitHub repository for continuous deployment, allowing new changes to be built and deployed when pushed to the configured branch.

## What I Learned

While building this project I practiced:

* Building a React application with TypeScript
* Designing reusable React components
* Managing application-wide authentication state with React Context
* Creating custom hooks for reusable data-fetching logic
* Working with REST APIs using Axios
* Designing TypeScript types for application and API data
* Integrating authentication with JWT
* Managing loading and error states
* Implementing CRUD operations
* Working with URL search parameters for filtering, sorting, and pagination
* Separating API logic from UI components
* Managing state and data flow between pages and components
* Building reusable modals, cards, buttons, badges, and form components
* Creating responsive layouts with Tailwind CSS
* Integrating a frontend with an existing REST API
* Deploying a frontend application with Google Cloud Run
* Connecting GitHub with automatic deployment
* Understanding frontend and backend responsibilities
* Making engineering decisions around component reuse, state management, and separation of concerns

## Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Projects

![Projects](screenshots/projects.png)

### Project Details

![Project Details](screenshots/projectDetails.png)

### Tasks

![Tasks](screenshots/tasks.png)

### Task Details

![Task Details](screenshots/taskDetails.png)
