import { type Task } from "../types/tasks"
import { type Note } from "../types/notes"
export const tasks: Task[] = [
  {
    id: 1,
    name: "Design Dashboard Layout",
    projectId: 1,
    status: "open",
    priority: "high",
    dueDate: "2026-7-20",
    description:
      "Create a responsive layout for the dashboard with all necessary components."
  },
  {
    id: 2,
    name: "Implement Authentication",
    projectId: 1,
    status: "completed",
    priority: "medium",
    dueDate: "2025-11-30",
    description: "Implement user authentication and authorization features."
  },
  {
    id: 3,
    name: "Write API Documentation",
    projectId: 2,
    status: "open",
    priority: "high",
    dueDate: "2026-10-31",
    description:
      "Create comprehensive documentation for the REST API endpoints."
  },
  {
    id: 4,
    name: "Optimize Landing Page",
    projectId: 3,
    status: "open",
    priority: "low",
    dueDate: "2026-12-31",
    description:
      "Optimize the landing page for better performance and user experience."
  },
  {
    id: 5,
    name: "Fix Responsive Navigation",
    projectId: 4,
    status: "completed",
    priority: "medium",
    dueDate: "2026-11-30",
    description: "Fix issues with the responsive navigation on mobile devices."
  },
  {
    id: 6,
    name: "Configure Client Access Controls",
    projectId: 5,
    status: "open",
    priority: "high",
    dueDate: "2026-09-25",
    description:
      "Set up client-specific permission groups and secure document visibility rules."
  },
  {
    id: 7,
    name: "Create Defect Severity Matrix",
    projectId: 6,
    status: "completed",
    priority: "low",
    dueDate: "2026-10-05",
    description:
      "Outline severity levels and team response expectations for the tracker backlog."
  },
  {
    id: 8,
    name: "Build Course Enrollment Flow",
    projectId: 7,
    status: "open",
    priority: "medium",
    dueDate: "2027-01-07",
    description:
      "Design the learner sign-up and enrollment path for the new platform experience."
  },
  {
    id: 9,
    name: "Schedule Vendor Check-In",
    projectId: 8,
    status: "completed",
    priority: "low",
    dueDate: "2026-11-18",
    description:
      "Coordinate the final venue and logistics call for the event schedule rollout."
  },
  {
    id: 10,
    name: "Draft KPI Dashboard Widgets",
    projectId: 9,
    status: "open",
    priority: "high",
    dueDate: "2027-02-28",
    description:
      "Create the core chart and summary widgets for the analytics console overview."
  }
]

export const notes: Note[] = [
  {
    id: 1,
    content:
      "Review the dashboard layout before moving to the implementation phase.",
    createdAt: "2023-10-01",
    taskId: 1
  },
  {
    id: 2,
    content:
      "Discuss the responsive behavior with the team during the next meeting.",
    createdAt: "2023-10-02",
    taskId: 2
  },
  {
    id: 3,
    content:
      "Keep the component structure reusable for future dashboard widgets.",
    createdAt: "2023-10-03",
    taskId: 3
  },
  {
    id: 4,
    content:
      "Confirm the dashboard wireframe aligns with stakeholder feedback before styling.",
    createdAt: "2023-10-04",
    taskId: 1
  },
  {
    id: 5,
    content:
      "Validate the dashboard card spacing and typography on a tablet viewport.",
    createdAt: "2023-10-05",
    taskId: 1
  },
  {
    id: 6,
    content:
      "Add role-based access checks before finalizing the authentication flow.",
    createdAt: "2023-10-06",
    taskId: 2
  },
  {
    id: 7,
    content: "Document the login session timeout behavior for support handoff.",
    createdAt: "2023-10-07",
    taskId: 2
  },
  {
    id: 8,
    content:
      "Use a consistent endpoint naming convention throughout the API guide.",
    createdAt: "2023-10-08",
    taskId: 3
  },
  {
    id: 9,
    content:
      "Include example payloads for all documented REST routes in the final draft.",
    createdAt: "2023-10-09",
    taskId: 3
  },
  {
    id: 10,
    content:
      "Review the landing page image compression strategy to reduce initial load time.",
    createdAt: "2023-10-10",
    taskId: 4
  },
  {
    id: 11,
    content:
      "Capture before-and-after performance metrics after the landing page changes.",
    createdAt: "2023-10-11",
    taskId: 4
  },
  {
    id: 12,
    content:
      "Test the mobile navigation overlap fix across common Android and iPhone widths.",
    createdAt: "2023-10-12",
    taskId: 5
  },
  {
    id: 13,
    content:
      "Confirm that the collapsed navigation menu preserves accessibility labels in all states.",
    createdAt: "2023-10-13",
    taskId: 5
  },
  {
    id: 14,
    content:
      "Confirm client access groups are scoped correctly for review and feedback workflows.",
    createdAt: "2023-10-14",
    taskId: 6
  },
  {
    id: 15,
    content:
      "Capture the final severity labels before handing the tracker spec to engineering.",
    createdAt: "2023-10-15",
    taskId: 7
  },
  {
    id: 16,
    content:
      "Review the enrollment UX for first-time learners and plan a progress nudges copy pass.",
    createdAt: "2023-10-16",
    taskId: 8
  },
  {
    id: 17,
    content:
      "Keep the final event vendor contact summary in a single shared checklist file.",
    createdAt: "2023-10-17",
    taskId: 9
  },
  {
    id: 18,
    content:
      "Share the KPI widget wireframe with stakeholders for approval before final polish.",
    createdAt: "2023-10-18",
    taskId: 10
  }
]
