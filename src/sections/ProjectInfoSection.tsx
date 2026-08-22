import { Check, Edit3, Clock } from "lucide-react"
import { useState } from "react"
import type { ProjectApiResponse, ProjectFields } from "../types/projects"
import StatusBadge from "../components/badges/StatusBadge"
import TechBadge from "../components/badges/TechBadge"
import TechStackSection from "./TechStackSection"
import dayjs from "dayjs"

type ProjectInfoSectionProps = {
  project: ProjectApiResponse
  onUpdate: (field: ProjectFields, data: string | boolean | string[]) => Promise<void>
  progress: number
  onDeleteTech: (tech: string) => Promise<void>
  onAddTech: (tech: string) => Promise<void>
}

function ProjectInfoSection({
  project,
  onUpdate,
  progress,
  onDeleteTech,
  onAddTech
}: ProjectInfoSectionProps) {
  const [isEditName, setIsEditName] = useState(false)
  const [projectName, setProjectName] = useState("")

  const [isEditDescription, setIsEditDescription] = useState(false)
  const [projectDescription, setProjectDescription] = useState("")

  const [isEditDuedate, setIsEditDuedate] = useState(false)
  const [projectDuedate, setProjectDuedate] = useState("")

  const [isEditTechStack, setIsEditTechStack] = useState(false)

  return (
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
              onClick={async () => {
                await onUpdate("name", projectName)
                setIsEditName(false)
              }}
            >
              <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
            </button>
          ) : (
            <button
              onClick={() => {
                setProjectName(project.name)
                setIsEditName(true)
              }}
            >
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
              onClick={async () => {
                await onUpdate("description", projectDescription)
                setIsEditDescription(false)
              }}
            >
              <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
            </button>
          ) : (
            <button
              onClick={() => {
                setProjectDescription(project.description)
                setIsEditDescription(true)
              }}
            >
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
              onClick={async () => {
                await onUpdate("dueDate", projectDuedate)
                setIsEditDuedate(false)
              }}
            >
              <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
            </button>
          ) : (
            <button
              onClick={() => {
                setProjectDuedate(project.dueDate)
                setIsEditDuedate(true)
              }}
            >
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
        {project.techStack.map((tech) => (
          <TechBadge
            key={tech}
            tech={tech}
            onDelete={onDeleteTech}
          />
        ))}

        {isEditTechStack && (
          <TechStackSection
            onAddTech={onAddTech}
            onDeleteTech={onDeleteTech}
          />
        )}

        {isEditTechStack ? (
          <button onClick={() => setIsEditTechStack(false)}>
            <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditTechStack(true)
            }}
          >
            <Edit3 className="h-4 w-4 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ProjectInfoSection
