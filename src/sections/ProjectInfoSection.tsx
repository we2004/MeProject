import { Check, Edit3 } from "lucide-react"
import { useState } from "react"
import type { ProjectApiResponse, ProjectStatus } from "../types/projects"
import StatusBadge from "../components/badges/StatusBadge"
import TechBadge from "../components/badges/TechBadge"
import TechStackSection from "./TechStackSection"
import EditableField from "../components/fields/EditableField"
import { type EditInfoFields } from "../types/common"
import type { TaskStatus } from "../types/tasks"
type ProjectInfoSectionProps = {
  project: ProjectApiResponse
  displayedProjectStatus?: ProjectStatus
  onUpdate: (
    field: EditInfoFields,
    data: string | boolean | string[] | TaskStatus
  ) => Promise<boolean | undefined>
  progress: number
  onDeleteTech: (tech: string) => Promise<void>
  onAddTech: (tech: string) => Promise<void>
  updateProjectLoading: boolean
}

function ProjectInfoSection({
  project,
  displayedProjectStatus,
  onUpdate,
  progress,
  onDeleteTech,
  onAddTech,
  updateProjectLoading
}: ProjectInfoSectionProps) {
  const [isEditTechStack, setIsEditTechStack] = useState(false)

  const status = displayedProjectStatus
    ? displayedProjectStatus
    : project.derivedStatus

  return (
    <div className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <EditableField
            data={project.name}
            field="name"
            onUpdate={onUpdate}
            loading={updateProjectLoading}
          />

          <StatusBadge status={status} />
        </div>

        <div className="flex items-center gap-10">
          <EditableField
            data={project.description}
            field="description"
            onUpdate={onUpdate}
            loading={updateProjectLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <EditableField
            data={project.dueDate}
            field="dueDate"
            onUpdate={onUpdate}
            loading={updateProjectLoading}
          />
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
