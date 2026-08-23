import { Trash2, CirclePlus, ArrowRight } from "lucide-react"

import TaskCard from "../components/cards/TaskCard"
import PrimaryButton from "../components/buttons/PrimaryButton"
import AttachmentCard from "../components/cards/AttachmentCard"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { calculateProgress } from "../utils/projects"
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

function ProjectsDetails() {
  const { token } = useAuth()
  const { projectId } = useParams()
  const {
    project,
    loading: projectLoading,
    error: projectError,
    updateProject,
    deleteCurrentProject
  } = useProject(token, Number(projectId))

  const {
    tasks: projectTasks,
    loading: taskLoading,
    error: taskError,
    updateTaskStatus,
    addTask,
    removeTask
  } = useTasks(token, 'all', 'all', 'asc', Number(projectId))

  const {projects} = useProjects(token, 'all', 'asc')

  const {
    attachments,
    loading: attachmentLoading,
    error: attachmentError,
    addAttachment,
    removeAttachment
  } = useAttachments(token, Number(projectId))

  const navigate = useNavigate()


  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)

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

  const progress = calculateProgress(Number(projectId), projectTasks)

  if (projectError) return <p>{projectError}</p>

  if (projectLoading) return <p>is loading...</p>

  if (!project) return <p>No project found</p>

  return (
    <section className="flex flex-col gap-15">
      {isDeleteModalOpen && (
        <DeleteModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteProject}
          btnText="Delete Project"
          message=" This action cannot be undone. Your Project and all associated tasks, notes, and attachments will be permanently deleted."
          title="Delete Project"
        />
      )}
      {isTaskModalOpen && (
        <AddTaskModal
          onClose={() => setIsTaskModalOpen(false)}
          projects={projects!}
          onSubmit={addTask}
          currentProjectId={Number(projectId)}
        />
      )}

      {isAttachmentModalOpen && (
        <AddAttachmentModal
          onClose={() => setIsAttachmentModalOpen(false)}
          onSubmit={addAttachment}
        />
      )}

      <ProjectInfoSection
        project={project}
        onUpdate={updateProject}
        progress={progress}
        onDeleteTech={handleDeleteTech}
        onAddTech={handleAddTech}
      />

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
          {projectTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="flex items-center w-full gap-3"
            >
              <div className="flex-1">
                <TaskCard
                  projectName={project.name}
                  {...task}
                  onStatusChange={updateTaskStatus}
                />
              </div>

              <button
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary-font shadow-sm transition-all duration-300 hover:bg-redT hover:text-white"
                onClick={() => removeTask(task.id)}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          {(projectTasks.length ?? 0) > 3 && (
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
                onClick={() => removeAttachment(attachment.id)}
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
        onClick={() => setIsDeleteModalOpen(true)}
      >
        Delete Project{" "}
      </button>
    </section>
  )
}

export default ProjectsDetails
