import { CirclePlus, ArrowRight } from "lucide-react"

import TaskCard from "../components/cards/TaskCard"
import PrimaryButton from "../components/buttons/PrimaryButton"
import AttachmentCard from "../components/cards/AttachmentCard"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { calculateProgress } from "../utils/projects"
import AddTaskModal from "../components/modals/AddTaskModal"
import AddAttachmentModal from "../components/modals/AddAttachmentModal"
import AttachmentPreviewModal from "../components/modals/AttachmentPreviewModal"
import { downloadAttachment } from "../api/attachments"
import { useAuth } from "../context/useAuth"
import DeleteModal from "../components/modals/DeleteModal"
import useProject from "../hooks/useProject"
import useAttachments from "../hooks/useAttachments"
import useAttachmentFiles from "../hooks/useAttachmentFiles"
import ProjectInfoSection from "../sections/ProjectInfoSection"
import useProjects from "../hooks/useProjects"
import useTasks from "../hooks/useTasks"
import useAllTasks from "../hooks/useAllTasks"
import ProjectsDetailsSkeleton from "../components/loading/skeletons/ProjectDetailsSkeleton"
import ErrorCard from "../components/cards/ErrorCard"
import PlaceHolderCard from "../components/cards/PlaceHolderCard"
import UpdatingIndicator from "../components/UpdatingIndicator"

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
    tasksHasData,
    pagination: taskPagination,
    addTaskLoading,
    updateTask,
    addTask,
    error: tasksError
  } = useTasks(token, "all", "all", "asc", Number(projectId))
  const {
    tasks: allProjectTasks,
    tasksHasData: allProjectTasksHasData,
    error: allProjectTasksError
  } = useAllTasks(token, Number(projectId))

  const { projects, error: projectsError } = useProjects(token, "all", "asc")

  const {
    attachments,
    attachmentLoading,
    attachmentsHasData,
    addAttachmentLoading,
    addAttachment,
    removeAttachment,
    error: attachmentsError
  } = useAttachments(token, Number(projectId))

  const {
    files: attachmentFiles,
    request: requestAttachmentFile,
    cancel: cancelAttachmentFile,
    removeFile: removeAttachmentFile,
    getCachedFile,
    cacheDownloadedFile
  } = useAttachmentFiles(token, Number(projectId))

  const navigate = useNavigate()

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)
  const [deletingAttachmentId, setDeletingAttachmentId] = useState<
    number | null
  >(null)
  const [confirmDeleteAttachmentId, setConfirmDeleteAttachmentId] = useState<
    number | null
  >(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [viewingAttachmentId, setViewingAttachmentId] = useState<number | null>(
    null
  )

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
    const cachedFile = getCachedFile(attachmentId)?.blob
    const previewFile = attachmentFiles[attachmentId]?.blob
    const attachment = attachments.find((item) => item.id === attachmentId)
    if (!attachment) throw new Error(`Attachment ${attachmentId} was not found`)

    const file =
      cachedFile ??
      previewFile ??
      (await downloadAttachment(token, attachmentId))
    if (!cachedFile && !previewFile) {
      await cacheDownloadedFile(attachmentId, attachment.type, file)
    }

    const url = URL.createObjectURL(file)

    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
  }

  const handleDeleteAttachment = async () => {
    if (confirmDeleteAttachmentId === null) return
    const attachmentId = confirmDeleteAttachmentId

    setDeletingAttachmentId(attachmentId)

    try {
      const success = await removeAttachment(attachmentId)
      if (success) removeAttachmentFile(attachmentId)
    } finally {
      setDeletingAttachmentId(null)
      setConfirmDeleteAttachmentId(null)
    }
  }

  if (projectLoading) return <ProjectsDetailsSkeleton />

  const viewingAttachment = attachments.find(
    (attachment) => attachment.id === viewingAttachmentId
  )

  const confirmDeleteAttachment = attachments.find(
    (attachment) => attachment.id === confirmDeleteAttachmentId
  )

  const progress = calculateProgress(Number(projectId), allProjectTasks)
  const displayedProgress = allProjectTasksHasData ? progress : undefined

  return (
    <section className="animate-fade-in flex flex-col gap-15">
      <div className="fixed right-6 top-25 z-9999 flex flex-col gap-3">
        {tasksError && <ErrorCard message={tasksError} />}
        {allProjectTasksError && <ErrorCard message={allProjectTasksError} />}
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
          udpateTaskLoading={addTaskLoading}
        />
      )}

      {isAttachmentModalOpen && (
        <AddAttachmentModal
          onClose={() => setIsAttachmentModalOpen(false)}
          onSubmit={addAttachment}
          addAttachmentLoading={addAttachmentLoading}
        />
      )}

      {viewingAttachment && (
        <AttachmentPreviewModal
          id={viewingAttachment.id}
          name={viewingAttachment.name}
          type={viewingAttachment.type}
          file={attachmentFiles[viewingAttachment.id]}
          onRequest={requestAttachmentFile}
          onClose={() => setViewingAttachmentId(null)}
          onDownload={handleDownloadAttachment}
        />
      )}

      {confirmDeleteAttachment && (
        <DeleteModal
          onCancel={() => setConfirmDeleteAttachmentId(null)}
          onDelete={handleDeleteAttachment}
          btnText="Delete Attachment"
          message={`"${confirmDeleteAttachment.name}" will be permanently deleted. This action cannot be undone.`}
          title="Delete Attachment"
          loading={deletingAttachmentId === confirmDeleteAttachment.id}
        />
      )}

      {project && (
        <ProjectInfoSection
          project={project}
          onUpdate={updateProject}
          progress={displayedProgress}
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
          {!tasksHasData && tasksLoading ? (
            <UpdatingIndicator active message="Loading project tasks" />
          ) : tasksHasData && project && projectTasks.length !== 0 ? (
            projectTasks.slice(0, 3).map((task) => (
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
              </div>
            ))
          ) : tasksHasData ? (
            <PlaceHolderCard message="No Tasks Yet" />
          ) : null}

          {project && taskPagination.totalItems > 3 && (
            <Link
              className="flex items-center gap-2 font-body font-medium text-primary transition-colors duration-300 hover:text-primary-font"
              to={`/tasks?projectId=${project.id}`}
            >
              See All {taskPagination.totalItems} Tasks
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

        {!attachmentsHasData && attachmentLoading ? (
          <UpdatingIndicator active message="Loading attachments" />
        ) : attachmentsHasData && attachments.length === 0 ? (
          <PlaceHolderCard message="No Attachments Yet" />
        ) : attachmentsHasData ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {attachments.map((attachment) => (
              <AttachmentCard
                key={attachment.id}
                id={attachment.id}
                name={attachment.name}
                type={attachment.type}
                file={attachmentFiles[attachment.id]}
                deleting={deletingAttachmentId === attachment.id}
                onDownload={handleDownloadAttachment}
                onView={setViewingAttachmentId}
                onDelete={setConfirmDeleteAttachmentId}
                onRequest={requestAttachmentFile}
                onCancel={cancelAttachmentFile}
              />
            ))}
          </div>
        ) : null}
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
