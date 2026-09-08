# MeProject

## Description

MeProject is personal project management application, it provides a simple workspace for creating and managing projects, tracking tasks, adding notes, and monitoring project progress.


## Live Demo

[View the live project](https://me-project99-seven.vercel.app/)


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
* Google Cloud Run (Backend)
* Vercel (Frontend)
* Supabase


## Backend

The backend REST API used by this project was fully AI-generated.

My work on this project focused primarily on the frontend application, including the UI, state management, API integration, authentication flow, reusable components, and overall frontend architecture.

The backend was later migrated from a local SQLite database to PostgreSQL hosted on Supabase. File attachments are stored using Supabase Storage, while the backend is deployed separately on Google Cloud Run.

For full API details, endpoints, and request/response structures, see backend2/API_DOCUMENTATION.md.

## Deployment

The application uses separate services for the frontend, backend, database, and file storage:

Frontend: Hosted on Vercel
Backend: Hosted on Google Cloud Run
Database: PostgreSQL hosted on Supabase
File Storage: Supabase Storage

The source code is maintained on GitHub and connected to the deployment platforms for automated deployments.


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
* Building responsive design using Tailwind
* Integrating a frontend with an existing REST API
* Deploying a backend with Google Cloud Run
* Connecting GitHub with automatic deployment
* Understanding frontend and backend responsibilities
* Making engineering decisions around component reuse, state management, and separation of concerns
  

## Screenshots

### Dashboard

![Dashboard](images/dashboard.png)

### Projects

![Projects](images/projects.png)

### Project Details

![Project Details](images/projectDetails.png)

### Tasks

![Tasks](images/tasks.png)

### Task Details

![Task Details](images/taskDetails.png)
