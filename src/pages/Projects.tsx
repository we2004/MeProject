import { CirclePlus, SlidersHorizontal } from "lucide-react"
import ProjectCard from "../components/cards/ProjectCard"
import PrimaryButton from "../components/buttons/PrimaryButton"
import DropdownButton from "../components/buttons/DropdownButton"
import { useSearchParams } from "react-router-dom"
import type { MenuType, SortOrder } from "../types/common"
import { useEffect, useState } from "react"
import type { ProjectStatusFilter } from "../types/projects"
import { calculateProgress, getProjectFilter } from "../utils/projects"
import SortByDateButton from "../components/buttons/SortByDateButton"
import AddProjectModal from "../components/modals/AddProjectModal"
import { useAuth } from "../context/useAuth"
import useProjects from "../hooks/useProjects"
import useTasks from "../hooks/useTasks"
import ProjectsSkeleton from "../components/loading/skeletons/ProjectsSkeleton"
import ErrorCard from "../components/cards/ErrorCard"
import PlaceHolderCard from "../components/cards/PlaceHolderCard"

function Projects() {
  const { token } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const order: SortOrder = searchParams.get("order") === "desc" ? "desc" : "asc"
  const filter: ProjectStatusFilter = getProjectFilter(
    searchParams.get("filter")
  )
  const {
    projects,
    projectsLoading,
    addProjectLoading,
    addProject,
    error: projectsError
  } = useProjects(token, filter, order)
  const {
    tasks,
    tasksLoading,
    error: tasksError
  } = useTasks(token, "all", "all", "asc")

  const [openMenu, setOpenMenu] = useState<MenuType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filters: ProjectStatusFilter[] = [
    "all",
    "active",
    "overdue",
    "cancelled",
    "completed"
  ]
  const nextOrder = order === "asc" ? "desc" : "asc"

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      const timer = setTimeout(() => {
        setIsModalOpen(true)
        setSearchParams((current) => {
          const params = new URLSearchParams(current)
          params.delete("create")
          return params
        }, {replace : true})
      }, 230)
      return () => clearTimeout(timer)
    }
  }, [searchParams, setSearchParams])

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
  if (projectsLoading || tasksLoading) return <ProjectsSkeleton />
  return (
    <section className="animate-fade-in flex flex-col gap-8 ">
      <div className="fixed right-6 top-25 z-9999 flex flex-col gap-3">
        {projectsError && <ErrorCard message={projectsError} />}
        {tasksError && <ErrorCard message={tasksError} />}
      </div>
      {isModalOpen && (
        <AddProjectModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={addProject}
          addProjectLoading={addProjectLoading}
        />
      )}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl font-bold text-primary-font text-center sm:text-start">
          My Projects
        </h1>

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

      {projects.length === 0 ? (
        <PlaceHolderCard message="No Projets Yet" />
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              progress={calculateProgress(project.id, tasks)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Projects
