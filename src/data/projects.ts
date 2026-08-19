import { type Attachment } from "../types/attachments"
import { type Project } from "../types/projects"
//change the data to include due dates, techstack and status if it was cancelled and remove progress and days left
export const projects: Project[] = [
  {
    id: 1,
    name: "ProjectFlow",
    description:
      "A modern project management application that helps users organize projects, tasks, attachments, and workflows efficiently.",
    dueDate: "2026-12-31",
    cancelled: false,
    techStack: ["React", "TypeScript", "Node.js"]
  },
  {
    id: 2,
    name: "AI Prompt Library",
    description:
      "A platform to organize, search, and manage AI prompts efficiently.",
    dueDate: "2027-12-31",
    cancelled: false,
    techStack: ["React", "TypeScript", "Node.js"]
  },
  {
    id: 3,
    name: "Personal Portfolio",
    description:
      "A responsive portfolio website showcasing projects and experience.",
    dueDate: "2026-12-31",
    cancelled: true,
    techStack: ["React", "TypeScript", "Node.js"]
  },
  {
    id: 4,
    name: "Expense Tracker",
    description:
      "Track expenses, budgets, and financial insights in one place.",
    dueDate: "2022-12-31",
    cancelled: false,
    techStack: ["React", "TypeScript", "Node.js"]
  },
  {
    id: 5,
    name: "Client Portal",
    description:
      "A secure client communication and project updates portal for shared milestones and document review.",
    dueDate: "2025-09-30",
    cancelled: false,
    techStack: ["React", "TypeScript", "Firebase"]
  },
  {
    id: 6,
    name: "Bug Tracker",
    description:
      "A lightweight issue tracking system for triaging software defects, team ownership, and resolution flow.",
    dueDate: "2026-10-15",
    cancelled: true,
    techStack: ["React", "Node.js", "MongoDB"]
  },
  {
    id: 7,
    name: "Learning Hub",
    description:
      "An educational content and course discovery platform for building structured learning paths.",
    dueDate: "2025-01-10",
    cancelled: false,
    techStack: ["React", "TypeScript", "PostgreSQL"]
  },
  {
    id: 8,
    name: "Event Planner",
    description:
      "A scheduling and event coordination application for organizing venues, speakers, and logistics.",
    dueDate: "2026-11-20",
    cancelled: true,
    techStack: ["React", "Node.js", "SQLite"]
  },
  {
    id: 9,
    name: "Analytics Console",
    description:
      "A business reporting workspace focused on KPIs, trend analysis, and executive dashboards.",
    dueDate: "2025-03-05",
    cancelled: false,
    techStack: ["React", "TypeScript", "Python"]
  }
]

export const attachments: Attachment[] = [
  {
    id: 1,
    name: "design-preview.png",
    type: "png",
    projectId: 1
  },
  {
    id: 2,
    name: "requirements.pdf",
    type: "pdf",
    projectId: 2
  },
  {
    id: 3,
    name: "project-notes.md",
    type: "md",
    projectId: 3
  },
  {
    id: 4,
    name: "Project Documentation",
    type: "link",
    projectId: 4
  }
]
