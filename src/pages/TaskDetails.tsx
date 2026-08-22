import {
  Edit3,
  FolderKanban,
  Clock,
  Trash2,
  CirclePlus,
  Check
} from "lucide-react"

import StatusBadge from "../components/badges/StatusBadge"
import PriorityBadge from "../components/badges/PriorityBadge"
import { useNavigate, useParams } from "react-router-dom"
import dayjs from "dayjs"
import NoteCard from "../components/cards/NoteCard"
import PrimaryButton from "../components/buttons/PrimaryButton"
import AddNoteModal from "../components/modals/AddNoteModal"
import { useEffect, useState } from "react"
import type { Task, TaskStatus } from "../types/tasks"
import { deleteTask, getTaskById, updateTaskData } from "../api/tasks"
import { type ProjectApiResponse } from "../types/projects"
import { getProjectById } from "../api/projects"
import { createNote, deleteNote, getNotesByTask } from "../api/notes"
import { type NoteApiResonse } from "../types/notes"
import { useAuth } from "../context/useAuth"

function TaskDetails() {
  const { token } = useAuth()
  const { taskId } = useParams()
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [task, setTask] = useState<Task | null>(null)
  const [project, setProject] = useState<ProjectApiResponse | null>(null)
  const [notes, setNotes] = useState<NoteApiResonse[] | null>(null)

  const [isEditName, setIsEditName] = useState(false)
  const [taskName, setTaskName] = useState("")
  const [isEditDescription, setIsEditDescription] = useState(false)
  const [taskDescription, setTaskDescription] = useState("")
  const [isEditDuedate, setIsEditDuedate] = useState(false)
  const [taskDuedate, setTaskDuedate] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const start = async () => {
      const taskData = await getTaskById(Number(taskId), token)
      const taskNotes = await getNotesByTask(taskData.id, token)

      setTask(taskData)
      setNotes(taskNotes)

      setTaskName(taskData.name)
      setTaskDescription(taskData.description)
      setTaskDuedate(taskData.dueDate)
    }

    start()
  }, [token, taskId])

  useEffect(() => {
    const start = async () => {
      if (!task) return
      const projectData = await getProjectById(task.projectId, token)
      setProject(projectData)
    }

    start()
  }, [task, token])

  if (!task || !project) {
    return <p>Task not found</p>
  }

  const displayStatus =
    task.status === "open" && dayjs(task.dueDate).isBefore(dayjs(), "day")
      ? "overdue"
      : task.status

  const handleUpdateTask = async (
    field: string,
    data: unknown,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    await updateTaskData(Number(taskId), field, data, token)

    setTask((currentTask) => {
      if (!currentTask) return currentTask

      return {
        ...currentTask,
        [field]: data
      }
    })

    setter(false)
  }

  const handleDeleteTask = async () => {
    await deleteTask(Number(taskId), token)
    navigate("/tasks")
  }

  const handleTaskStatusChange = async (newStatus: TaskStatus) => {
    await updateTaskData(Number(taskId), "status", newStatus, token)

    setTask((current) => {
      if (!current) return current

      return {
        ...current,
        status: newStatus
      }
    })
  }

  const handleAddNote = async (notes: string[]) => {
    for (const content of notes) {
      await createNote(token, { content: content, taskId: task.id })
    }

    const updatedNotes = await getNotesByTask(Number(taskId), token)
    setNotes(updatedNotes)
  }

  const handleDeleteNote = async (noteId: number) => {
    await deleteNote(token, noteId)

    const updatedNotes = await getNotesByTask(task.id, token)
    setNotes(updatedNotes)
  }

  if (!notes) return <p>something is wrong</p>

  return (
    <section className="flex flex-col gap-8">
      {/* Task Information */}

      {isNoteModalOpen && (
        <AddNoteModal
          onClose={() => setIsNoteModalOpen(false)}
          onSubmit={handleAddNote}
        />
      )}

      <div className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          {/* Task Name */}
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className={`font-heading text-2xl sm:text-3xl font-bold text-primary-font ${isEditName ? "hidden" : ""}`}
            >
              {task.name}
            </h1>

            {isEditName && (
              <input
                type="text"
                className="rounded-2xl border border-primary/45 bg-white px-2 py-3 font-heading text-2xl font-bold text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            )}

            {isEditName ? (
              <button
                onClick={async () =>
                  await handleUpdateTask("name", taskName, setIsEditName)
                }
              >
                <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
              </button>
            ) : (
              <button onClick={() => setIsEditName(true)}>
                <Edit3 className="h-4 w-4 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
              </button>
            )}

            <StatusBadge
              status={displayStatus}
              interactive
              onStatusChange={handleTaskStatusChange}
            />
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Description */}
          <div className="flex items-center gap-2">
            <p
              className={`flex-1 font-body leading-7 text-primary-font/70 ${isEditDescription ? "hidden" : ""}`}
            >
              {task.description}
            </p>

            {isEditDescription && (
              <textarea
                rows={5}
                className="flex-1 max-w-260 rounded-2xl border border-primary/45 bg-white px-2 py-3 font-body text-primary-font/70 outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            )}

            {isEditDescription ? (
              <button
                onClick={async () =>
                  await handleUpdateTask(
                    "description",
                    taskDescription,
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

          {/* Due Date */}
          <div className="flex items-center gap-2 mt-3">
            <Clock className="h-5 w-5 text-primary" />

            <span
              className={`font-body text-primary-font ${isEditDuedate ? "hidden" : ""}`}
            >
              {dayjs(task.dueDate).format("MMMM D, YYYY")}
            </span>

            {isEditDuedate && (
              <input
                type="date"
                className="rounded-2xl border border-primary/45 bg-white px-2 py-2 font-body text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
                value={taskDuedate}
                onChange={(e) => setTaskDuedate(e.target.value)}
              />
            )}

            {isEditDuedate ? (
              <button
                onClick={async () =>
                  await handleUpdateTask(
                    "dueDate",
                    taskDuedate,
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

          {/* Project */}
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />

            <span className="font-body text-primary-font">{project?.name}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-2xl font-semibold text-primary-font">
            Notes
          </h2>

          <PrimaryButton
            Icon={CirclePlus}
            onClickFun={() => setIsNoteModalOpen(true)}
          >
            Add Note
          </PrimaryButton>
        </div>

        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex items-center gap-3"
            >
              <div className="flex-1">
                <NoteCard {...note} />
              </div>

              <button
                onClick={() => handleDeleteNote(note.id)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary-font shadow-sm transition-all duration-300 hover:bg-redT hover:text-white"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        className="bg-redT rounded-[15px] text-md font-body py-3 text-white transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
        onClick={handleDeleteTask}
      >
        DeleteProject{" "}
      </button>
    </section>
  )
}

export default TaskDetails
