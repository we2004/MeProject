import { CalendarDays, ChevronDown, FileText, StickyNote } from "lucide-react"
import Modal from "./Modal"
import NoteSection from "../../sections/NoteSection"
import { useState } from "react"
import type { ProjectApiResponse } from "../../types/projects"
import type { CreateTask, TaskStatus, TaskPriority } from "../../types/tasks"

type AddTaskModalProps = {
  onClose: () => void
  projects: ProjectApiResponse[]
  onSubmit: (newItem: CreateTask, notes: string[]) => Promise<boolean>
  currentProjectId?: number
  udpateTaskLoading: boolean
}

function AddTaskModal({
  onClose,
  projects,
  onSubmit,
  currentProjectId,
  udpateTaskLoading
}: AddTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState("")
  const [projectOption, setProjectOption] = useState<number | "">("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<TaskPriority | "">("")
  const [description, setDescription] = useState("")
  const [notes, setNotes] = useState<string[]>([])
  const status: TaskStatus = "open"

  const handleAddNote = (note: string) => {
    if (!note.trim()) return
    setNotes((currentNotes) => [...currentNotes, note])
  }

  const handleDeleteNote = (note: string) => {
    const newNotes = [...notes]
    newNotes.splice(newNotes.indexOf(note), 1)
    setNotes(newNotes)
  }

  return (
    <Modal
      modalTitle="Create Task"
      modalDescription="Add the details of the new Task."
      onClose={onClose}
      onSubmit={async () => {
        let selectedProjectId = currentProjectId ?? projectOption

        if (selectedProjectId === "") 
          selectedProjectId = -1

        const newTask: CreateTask = {
          name: taskTitle,
          projectId: selectedProjectId,
          status,
          priority: priority ?? "low",
          dueDate,
          description
        }

        const success = await onSubmit(newTask, notes)
        if(success)
          onClose()
      }}
      loading={udpateTaskLoading}
    >
      {/* General Information */}
      <div className="flex flex-col gap-5">
        <h3 className="font-heading text-lg font-semibold text-primary-font">
          Task Information
        </h3>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="task-title"
            className="font-body text-sm font-medium text-primary-font"
          >
            Task Title <span className="text-primary">*</span>
          </label>

          <input
            id="task-title"
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="task-description"
            className="flex items-center gap-2 font-body text-sm font-medium text-primary-font"
          >
            <FileText className="h-4 w-4 text-primary" />
            Description<span className="text-primary">*</span>
          </label>

          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe what needs to be done..."
            className="resize-none rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-sm leading-6 text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Project */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="task-project"
            className="font-body text-sm font-medium text-primary-font"
          >
            Project <span className="text-primary">*</span>
          </label>

          <div className="relative">
            <select
              id="task-project"
              value={currentProjectId ? currentProjectId : projectOption}
              onChange={(e) => {
                const value = e.target.value
                setProjectOption(value === "" ? "" : Number(value))
              }}
              className="w-full appearance-none rounded-2xl border border-primary/15 bg-white px-4 py-3 pr-11 font-body text-sm text-primary-font outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option
                value=""
                disabled
              >
                Select a project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-font/50" />
          </div>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="task-due-date"
            className="font-body text-sm font-medium text-primary-font"
          >
            Due Date <span className="text-primary">*</span>
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-font/50" />

            <input
              id="task-due-date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="w-full rounded-2xl border border-primary/15 bg-white py-3 pl-12 pr-4 font-body text-sm text-primary-font outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="task-priority"
            className="font-body text-sm font-medium text-primary-font"
          >
            Priority <span className="text-primary">*</span>
          </label>

          <div className="relative">
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full appearance-none rounded-2xl border border-primary/15 bg-white px-4 py-3 pr-11 font-body text-sm text-primary-font outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option
                value=""
                disabled
              >
                Select priority
              </option>

              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-font/50" />
          </div>
        </div>
      </div>

      {/* Optional Information */}
      <div className="border-t border-primary/10 pt-6">
        <div className="mb-5">
          <h3 className="font-heading text-lg font-semibold text-primary-font">
            Optional Information
          </h3>

          <p className="mt-1 font-body text-sm text-primary-font/60">
            You can add these details now or later.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="task-notes"
              className="flex items-center gap-2 font-body text-sm font-medium text-primary-font"
            >
              <StickyNote className="h-4 w-4 text-primary" />
              Notes
            </label>
            <NoteSection
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddTaskModal
