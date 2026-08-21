import { CirclePlus, SlidersHorizontal } from "lucide-react"
import ProjectCard from "../components/cards/ProjectCard"
import PrimaryButton from "../components/buttons/PrimaryButton"
import DropdownButton from "../components/buttons/DropdownButton"
import { useSearchParams } from "react-router-dom"
import type { MenuType, SortOrder } from "../types/common"
import { useState, useEffect } from "react"
import type {
  ProjectApiResponse,
  Project,
  ProjectStatusFilter
} from "../types/projects"
import { getProjectFilter } from "../utils/projects"
import SortByDateButton from "../components/buttons/SortByDateButton"
import AddProjectModal from "../components/modals/AddProjectModal"
import { createProject } from "../api/projects"
import { getProjects } from "../api/projects"
import { createAttachment } from "../api/attachments"
import { useAuth } from "../context/useAuth"
function Projects() {
  const {token} = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects, setProjects] = useState<ProjectApiResponse[]>([])
  const [openMenu, setOpenMenu] = useState<MenuType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const order: SortOrder = searchParams.get("order") === "desc" ? "desc" : "asc"
  const filter: ProjectStatusFilter = getProjectFilter(
    searchParams.get("filter")
  )

  const filters: ProjectStatusFilter[] = [
    "all",
    "active",
    "overdue",
    "cancelled",
    "completed"
  ]
  const nextOrder = order === "asc" ? "desc" : "asc"

  const handleFilterSelect = (newFilter: ProjectStatusFilter) => {
    setSearchParams({
      filter: newFilter,
      order
    })
  }

  const handleToggleOrder = () => {
    setSearchParams({
      order: nextOrder,
      filter
    })
  }

  useEffect(() => {
    const start = async () => {
      const projectsData = await getProjects(token, filter, order)
      setProjects(projectsData)
    }

    start()
  }, [token, filter, order])

  const handleAddProject = async (newProject: Project, files: File[]) => {
    const response = await createProject(token, newProject)
    const projectsData = await getProjects(token, filter, order)

    for (const file of files) {
      await createAttachment(token, {
        file: file,
        projectId: Number(response.id)
      })
    }

    setProjects(projectsData)
  }

  return (
    <section className="flex flex-col gap-8">
      {isModalOpen && (
        <AddProjectModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProject}
        />
      )}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary-font text-center sm:text-start">
            My Projects
          </h1>
        </div>

        <PrimaryButton
          Icon={CirclePlus}
          onClickFun={() => setIsModalOpen(true)}
        >
          Create Project
        </PrimaryButton>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
        <DropdownButton
          Icon={SlidersHorizontal}
          menuType="projectStatus"
          options={filters}
          selectedOption={filter}
          setOpenMenu={setOpenMenu}
          showMenu={openMenu}
          onSelect={handleFilterSelect}
        >
          Filter Status
        </DropdownButton>

        <SortByDateButton onToggle={handleToggleOrder} />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            {...project}
            token={token}
          />
        ))}
      </div>
    </section>
  )
}

export default Projects
