import { CalendarDays } from "lucide-react"
import Modal from "./Modal"
import AttachmentSection from "../../sections/AttachmentSection"
import { useState } from "react"
import { type Project } from "../../types/projects"
import TechStackSection from "../../sections/TechStackSection"
type AddProjectModalProps = {
  onClose: () => void
  onSubmit: (newProject: Project, files: File[]) => Promise<boolean>
  addProjectLoading: boolean
}

function AddProjectModal({
  onClose,
  onSubmit,
  addProjectLoading
}: AddProjectModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectDueDate, setProjectDueDate] = useState("")
  const [techStack, setTechStack] = useState<string[]>([])

  const handleAddTech = (tech: string) => {
    if (!tech.trim()) return
    setTechStack([...techStack, tech])
  }

  const handleDeleteTech = (tech: string) => {
    const newTechStack = [...techStack]
    newTechStack.splice(newTechStack.indexOf(tech), 1)
    setTechStack(newTechStack)
  }

  const handleAddAttachment = (newFiles: File[]) => {
    setFiles((current) => [...current, ...newFiles])
  }

  const handleDeleteFile = (file: File) => {
    setFiles((current) => current.filter((currentFile) => currentFile !== file))
  }

  return (
    <Modal
      modalTitle="Create Project"
      modalDescription="Add the details of the new Project."
      onClose={onClose}
      onSubmit={async () => {
        const newProject = {
          name: projectName,
          description: projectDescription,
          dueDate: projectDueDate,
          cancelled: false,
          techStack: techStack
        }
        const success = await onSubmit(newProject, files)
        if (success) onClose()
      }}
      loading={addProjectLoading}
    >
      {/* General Information */}
      <div className="flex flex-col gap-5">
        <h3 className="font-heading text-lg font-semibold text-primary-font">
          Project Information
        </h3>

        {/* Project Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="project-name"
            className="font-body text-sm font-medium text-primary-font"
          >
            Project Name <span className="text-primary">*</span>
          </label>

          <input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            type="text"
            placeholder="Enter project name"
            className="rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="project-description"
            className="font-body text-sm font-medium text-primary-font"
          >
            Description <span className="text-primary">*</span>
          </label>

          <textarea
            id="project-description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={4}
            placeholder="Describe what this project is about..."
            className="resize-none rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-sm leading-6 text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="project-due-date"
            className="font-body text-sm font-medium text-primary-font"
          >
            Due Date <span className="text-primary">*</span>
          </label>

          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-font/50" />

            <input
              id="project-due-date"
              value={projectDueDate}
              onChange={(e) => setProjectDueDate(e.target.value)}
              type="date"
              className="w-full rounded-2xl border border-primary/15 bg-white py-3 pl-12 pr-4 font-body text-sm text-primary-font outline-none transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
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
          {/* Tech Stack */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tech-stack"
              className="font-body text-sm font-medium text-primary-font"
            >
              Tech Stack
            </label>

            <TechStackSection
              onAddTech={handleAddTech}
              onDeleteTech={handleDeleteTech}
              techStack={techStack}
            />
          </div>

          {/* Attachments */}
          <div className="flex flex-col gap-2">
            <label className="font-body text-sm font-medium text-primary-font">
              Attachments
            </label>

            <AttachmentSection
              files={files}
              onAddAttachment={handleAddAttachment}
              onDeleteAttachment={handleDeleteFile}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddProjectModal
