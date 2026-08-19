import {
  Edit3,
  Trash2,
  Clock,
  CirclePlus,
  ArrowRight,
  Check
} from "lucide-react"

import TaskCard from "../components/cards/TaskCard"
import StatusBadge from "../components/badges/StatusBadge"
import TechBadge from "../components/badges/TechBadge"
import PrimaryButton from "../components/buttons/PrimaryButton"
import AttachmentCard from "../components/cards/AttachmentCard"
import { attachments } from "../data/projects"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { calculateProgress } from "../utils/projects"
import AddTaskModal from "../components/modals/AddTaskModal"
import dayjs from "dayjs"
import AddAttachmentModal from "../components/modals/AddAttachmentModal"
import type { ProjectApiResponse } from "../types/projects"
import type { TaskApiResponse, TaskStatus, CreateTask } from "../types/tasks"
import { getTasksByProject, createTask, deleteTask } from "../api/tasks"
import {
  getProjectById,
  updateProjectData,
  deleteProject,
  getProjects
} from "../api/projects"
import TechStackSection from "../sections/TechStackSection"
import { createNote } from "../api/notes"

function ProjectsDetails({ token }: { token: string }) {
  const { projectId } = useParams()
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectApiResponse[] | null>(null)
  const [project, setProject] = useState<ProjectApiResponse | null>(null)
  const [projectTasks, setProjectTasks] = useState<TaskApiResponse | null>(null)
  const [isEditName, setIsEditName] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [isEditDescription, setIsEditDescription] = useState(false)
  const [projectDescription, setProjectDescription] = useState("")
  const [isEditDuedate, setIsEditDuedate] = useState(false)
  const [projectDuedate, setProjectDuedate] = useState("")
  const [isEditTechStack, setIsEditTechStack] = useState(false)
  const [projectTechStack, setProjectTechStack] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const start = async () => {
      if (!projectId || !token) {
        return
      }

      const projectData = await getProjectById(Number(projectId), token)
      setProject(projectData)
      setProjectName(projectData.name)
      setProjectDescription(projectData.description)
      setProjectDuedate(projectData.dueDate)
      setProjectTechStack(projectData.techStack)

      const tasksData = await getTasksByProject(
        Number(projectId),
        token,
        "all",
        "all",
        "asc"
      )
      setProjectTasks(tasksData)
    }

    start()
  }, [projectId, token])

  useEffect(() => {
    const start = async () => {
      const projectsData = await getProjects(token, "all", "asc")
      setProjects(projectsData)
    }

    start()
  }, [token])

  const handleUpdateProject = async (
    field: string,
    data: unknown,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    await updateProjectData(Number(projectId), field, data, token)

    setProject((currentProject) => {
      if (!currentProject) return currentProject

      return {
        ...currentProject,
        [field]: data
      }
    })

    setter(false)
  }

  const handleDeleteTech = async (tech: string) => {
    const newTechStack = projectTechStack.filter((item) => item !== tech)

    await updateProjectData(Number(projectId), "techStack", newTechStack, token)

    setProjectTechStack(newTechStack)

    setProject((currentProject) => {
      if (!currentProject) return currentProject

      return {
        ...currentProject,
        techStack: newTechStack
      }
    })
  }

  const handleAddTech = (tech: string) => {
    if (!tech.trim()) return
    setProjectTechStack([...projectTechStack, tech])
  }

  const handleTaskStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setProjectTasks((current) => {
      if (!current) return current

      return {
        ...current,
        data: current.data.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      }
    })
  }

  const handleDeleteProject = async () => {
    await deleteProject(Number(projectId), token)
    navigate("/projects")
  }

  const handleAddTask = async (newTask: CreateTask, notes: string[]) => {
    const response = await createTask(token, newTask)
    for (const content of notes) {
      await createNote(token, { content: content, taskId: response.id })
    }
    const updatedTasks = await getTasksByProject(
      Number(projectId),
      token,
      "all",
      "all",
      "asc"
    )
    setProjectTasks(updatedTasks)
  }

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(Number(taskId), token)

    const updatedTasks = await getTasksByProject(
      Number(projectId),
      token,
      "all",
      "all",
      "asc"
    )
    setProjectTasks(updatedTasks)
  }

  const progress = calculateProgress(Number(projectId), projectTasks?.data)

  return (
    project && (
      <section className="flex flex-col gap-15">
        {isTaskModalOpen && (
          <AddTaskModal
            onClose={() => setIsTaskModalOpen(false)}
            projects={projects!}
            onSubmit={handleAddTask}
            currentProjectId={Number(projectId)}
          />
        )}

        {isAttachmentModalOpen && (
          <AddAttachmentModal onClose={() => setIsAttachmentModalOpen(false)} />
        )}
        <div className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <h1
                className={`font-heading text-3xl font-bold text-primary-font ${isEditName ? "hidden" : ""}`}
              >
                {project.name}
              </h1>

              {isEditName && (
                <input
                  type="text"
                  className="rounded-2xl border border-primary/45 bg-white px-2 py-3 font-heading text-2xl font-bold text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              )}

              {isEditName ? (
                <button
                  onClick={async () =>
                    await handleUpdateProject(
                      "name",
                      projectName,
                      setIsEditName
                    )
                  }
                >
                  <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
                </button>
              ) : (
                <button onClick={() => setIsEditName(true)}>
                  <Edit3 className="h-4 w-4 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
                </button>
              )}

              <StatusBadge status={project.derivedStatus} />
            </div>

            <div className="flex items-center gap-10">
              <p
                className={`flex-1  leading-7 text-primary-font/70 ${isEditDescription ? "hidden" : ""}`}
              >
                {project.description}
              </p>

              {isEditDescription && (
                <textarea
                  rows={5}
                  className="flex-1 max-w-260 rounded-2xl border border-primary/45 bg-white px-2 py-3 font-body text-primary-font/70 outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              )}

              {isEditDescription ? (
                <button
                  onClick={async () =>
                    await handleUpdateProject(
                      "description",
                      projectDescription,
                      setIsEditDescription
                    )
                  }
                >
                  <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
                </button>
              ) : (
                <button onClick={() => setIsEditDescription(true)}>
                  <Edit3 className="h-4 w-4 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />

              <span
                className={`font-body text-primary-font ${isEditDuedate ? "hidden" : ""}`}
              >
                {dayjs(project.dueDate).format("MMMM D, YYYY")}
              </span>

              {isEditDuedate && (
                <input
                  type="date"
                  className="rounded-2xl border border-primary/45 bg-white px-2 py-2 font-body text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  value={projectDuedate}
                  onChange={(e) => setProjectDuedate(e.target.value)}
                />
              )}

              {isEditDuedate ? (
                <button
                  onClick={async () =>
                    await handleUpdateProject(
                      "dueDate",
                      projectDuedate,
                      setIsEditDuedate
                    )
                  }
                >
                  <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
                </button>
              ) : (
                <button onClick={() => setIsEditDuedate(true)}>
                  <Edit3 className="h-4 w-4 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
                </button>
              )}
            </div>

            <div>
              <div className="mb-2 flex justify-between font-body text-sm text-primary-font/70">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-primary/10">
                <div
                  className={`h-full rounded-full bg-primary`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            {projectTechStack.map((tech) => (
              <TechBadge
                key={tech}
                tech={tech}
                onDelete={handleDeleteTech}
              />
            ))}

            {isEditTechStack && (
              <TechStackSection
                onAddTech={handleAddTech}
                onDeleteTech={handleDeleteTech}
              />
            )}

            {isEditTechStack ? (
              <button
                onClick={async () =>
                  await handleUpdateProject(
                    "techStack",
                    projectTechStack,
                    setIsEditTechStack
                  )
                }
              >
                <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
              </button>
            ) : (
              <button onClick={() => setIsEditTechStack(true)}>
                <Edit3 className="h-4 w-4 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
              </button>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl font-semibold text-primary-font">
              Tasks
            </h2>

            <PrimaryButton
              Icon={CirclePlus}
              onClickFun={() => setIsTaskModalOpen(true)}
            >
              Add Task
            </PrimaryButton>
          </div>

          <div className="flex flex-col items-center justify-center gap-5">
            {projectTasks?.data.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center w-full gap-3"
              >
                <div className="flex-1">
                  <TaskCard
                    projectName={project.name}
                    {...task}
                    token={token}
                    onStatusChange={handleTaskStatusChange}
                  />
                </div>

                <button
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary-font shadow-sm transition-all duration-300 hover:bg-redT hover:text-white"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            {(projectTasks?.data.length ?? 0) > 3 && (
              <Link
                className="flex items-center gap-2 font-body font-medium text-primary transition-colors duration-300 hover:text-primary-font"
                to={`/tasks?projectId=${project.id}`}
              >
                See All {projectTasks?.data.length} Tasks
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Attachments */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-2xl font-semibold text-primary-font">
              Attachments
            </h2>

            <PrimaryButton
              Icon={CirclePlus}
              onClickFun={() => setIsAttachmentModalOpen(true)}
            >
              Add Attachment
            </PrimaryButton>
          </div>

          <div className="flex flex-col gap-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3"
              >
                <div className="flex-1">
                  <AttachmentCard {...attachment} />
                </div>

                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary-font shadow-sm transition-all duration-300 hover:bg-redT hover:text-white">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          className="border-2 border-redT rounded-[15px] text-md font-body py-3 hover:bg-redT hover:text-white transition-all duration-300 cursor-pointer"
          onClick={handleDeleteProject}
        >
          Delete Project
        </button>
      </section>
    )
  )
}

export default ProjectsDetails
