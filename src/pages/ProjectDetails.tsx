import { Trash2, CirclePlus, ArrowRight } from "lucide-react"

import TaskCard from "../components/cards/TaskCard"
import PrimaryButton from "../components/buttons/PrimaryButton"
import AttachmentCard from "../components/cards/AttachmentCard"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { calculateProgress, getProjectStatus } from "../utils/projects"
import AddTaskModal from "../components/modals/AddTaskModal"
import AddAttachmentModal from "../components/modals/AddAttachmentModal"
import { downloadAttachment } from "../api/attachments"
import { useAuth } from "../context/useAuth"
import DeleteModal from "../components/modals/DeleteModal"
import useProject from "../hooks/useProject"
import useAttachments from "../hooks/useAttachments"
import ProjectInfoSection from "../sections/ProjectInfoSection"
import useProjects from "../hooks/useProjects"
import useTasks from "../hooks/useTasks"
import ProjectsDetailsSkeleton from "../components/loading/skeletons/ProjectDetailsSkeleton"
import Spinner from "../components/loading/spinners/Spinner"
import ErrorCard from "../components/cards/ErrorCard"

function ProjectsDetails() {
  const { token } = useAuth()
  const { projectId } = useParams()
  const {
    project,
    projectLoading,
    deleteProjectLoading,
    updateProjectLoading,
    updateProject,
    deleteCurrentProject,
    error: projectError
  } = useProject(token, Number(projectId))

  const {
    tasks: projectTasks,
    tasksLoading,
    udpateTaskLoading,
    updateTask,
    addTask,
    removeTask,
    error: tasksError
  } = useTasks(token, "all", "all", "asc", Number(projectId))

  const { projects, error: projectsError } = useProjects(token, "all", "asc")

  const {
    attachments,
    attachmentLoading,
    addAttachmentLoading,
    addAttachment,
    removeAttachment,
    error: attachmentsError
  } = useAttachments(token, Number(projectId))

  const navigate = useNavigate()

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)
  const [deletingAttachmentId, setDeletingAttachmentId] = useState<
    number | null
  >(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteTech = async (tech: string) => {
    if (!project) return
    const newTechStack = project.techStack.filter((item) => item !== tech)

    await updateProject("techStack", newTechStack)
  }

  const handleAddTech = async (tech: string) => {
    if (!tech.trim() || !project) return

    const newTechStack = [...project.techStack, tech]

    await updateProject("techStack", newTechStack)
  }

  const handleDeleteProject = async () => {
    const success = await deleteCurrentProject()
    if (success) navigate("/projects")
  }

  const handleDownloadAttachment = async (
    attachmentId: number,
    fileName: string
  ) => {
    const file = await downloadAttachment(token, attachmentId)

    const url = URL.createObjectURL(file)

    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
  }

  if (tasksLoading || projectLoading || attachmentLoading)
    return <ProjectsDetailsSkeleton />

  const progress = calculateProgress(Number(projectId), projectTasks)
  const displayedStatus = project
    ? getProjectStatus(project, projectTasks)
    : undefined

  return (
    <section className="animate-fade-in flex flex-col gap-15">
      <div className="fixed right-6 top-25 z-9999 flex flex-col gap-3">
        {tasksError && <ErrorCard message={tasksError} />}
        {attachmentsError && <ErrorCard message={attachmentsError} />}
        {projectsError && <ErrorCard message={projectsError} />}
        {projectError && <ErrorCard message={projectError} />}
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteProject}
          btnText="Delete Project"
          message=" This action cannot be undone. Your Project and all associated tasks, notes, and attachments will be permanently deleted."
          title="Delete Project"
          loading={deleteProjectLoading}
        />
      )}
      {isTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsTaskModalOpen(false)}
          projects={projects}
          onSubmit={addTask}
          currentProjectId={Number(projectId)}
          udpateTaskLoading={udpateTaskLoading}
        />
      )}

      {isAttachmentModalOpen && (
        <AddAttachmentModal
          onClose={() => setIsAttachmentModalOpen(false)}
          onSubmit={addAttachment}
          addAttachmentLoading={addAttachmentLoading}
        />
      )}

      {project && (
        <ProjectInfoSection
          project={project}
          displayedProjectStatus={displayedStatus}
          onUpdate={updateProject}
          progress={progress}
          onDeleteTech={handleDeleteTech}
          onAddTech={handleAddTech}
          updateProjectLoading={updateProjectLoading}
        />
      )}

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
          {project && projectTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="flex items-center w-full gap-3"
            >
              <div className="flex-1">
                <TaskCard
                  projectName={project.name}
                  {...task}
                  onUpdate={(field, data) => updateTask(task.id, field, data)}
                />
              </div>

              <button
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary-font shadow-sm transition-all duration-300 hover:bg-redT hover:text-white"
                onClick={async () => {
                  setDeletingTaskId(task.id)

                  try {
                    await removeTask(task.id)
                  } finally {
                    setDeletingTaskId(null)
                  }
                }}
              >
                {deletingTaskId === task.id ? (
                  <Spinner
                    size="sm"
                    color="dark"
                  />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}

          {project && projectTasks.length > 3 && (
            <Link
              className="flex items-center gap-2 font-body font-medium text-primary transition-colors duration-300 hover:text-primary-font"
              to={`/tasks?projectId=${project.id}`}
            >
              See All {projectTasks.length} Tasks
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
                <AttachmentCard
                  {...attachment}
                  onDownload={handleDownloadAttachment}
                />
              </div>

              <button
                onClick={async () => {
                  setDeletingAttachmentId(attachment.id)

                  try {
                    await removeAttachment(attachment.id)
                  } finally {
                    setDeletingAttachmentId(null)
                  }
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary-font shadow-sm transition-all duration-300 hover:bg-redT hover:text-white"
              >
                {deletingAttachmentId === attachment.id ? (
                  <Spinner
                    size="sm"
                    color="dark"
                  />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        className="bg-redT rounded-[15px] text-md font-body py-3 text-white transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        Delete Project{" "}
      </button>
    </section>
  )
}

export default ProjectsDetails
