import { Trash2, CirclePlus } from "lucide-react"

import { useNavigate, useParams } from "react-router-dom"
import NoteCard from "../components/cards/NoteCard"
import PrimaryButton from "../components/buttons/PrimaryButton"
import AddNoteModal from "../components/modals/AddNoteModal"
import { useState } from "react"
import { useAuth } from "../context/useAuth"
import useTask from "../hooks/useTask"
import useNotes from "../hooks/useNotes"
import useProject from "../hooks/useProject"
import TaskInfoSection from "../sections/TaskInfoSection"
import TaskDetailsSkeleton from "../components/loading/skeletons/TaskDetails"
import DeleteModal from "../components/modals/DeleteModal"
import ErrorCard from "../components/cards/ErrorCard"
import Spinner from "../components/loading/spinners/Spinner"
import PlaceHolderCard from "../components/cards/PlaceHolderCard"

function TaskDetails() {
  const { token } = useAuth()

  const { taskId } = useParams()
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null)

  const {
    task,
    taskLoading,
    removeTaskLoading,
    updateTaskLoading,
    removeTask,
    updateTask,
    error: taskError
  } = useTask(token, Number(taskId))

  const {
    notes,
    notesLoading,
    addNoteLoading,
    addNote,
    removeNote,
    error: notesError
  } = useNotes(token, Number(taskId))

  const {
    project,
    projectLoading,
    error: projectError
  } = useProject(token, task?.projectId)

  const navigate = useNavigate()

  const handleDeleteTask = async () => {
    const success = await removeTask()
    if (success) navigate("/tasks")
  }

  if (taskLoading || notesLoading || projectLoading)
    return <TaskDetailsSkeleton />

  return (
    <section className="animate-fade-in flex flex-col gap-8">
      {/* Task Information */}

      <div className="fixed right-6 top-25 z-9999 flex flex-col gap-3">
        {taskError && <ErrorCard message={taskError} />}
        {projectError && <ErrorCard message={projectError} />}
        {notesError && <ErrorCard message={notesError} />}
      </div>

      {isNoteModalOpen && (
        <AddNoteModal
          onClose={() => setIsNoteModalOpen(false)}
          onSubmit={addNote}
          addNoteLoading={addNoteLoading}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteTask}
          btnText="Delete Task"
          message=" This action cannot be undone. Your Task and all associated notes, and attachments will be permanently deleted."
          title="Delete Task"
          loading={removeTaskLoading}
        />
      )}

      {task && project && (
        <TaskInfoSection
          onUpdate={updateTask}
          task={task}
          projectName={project.name}
          updateTaskLoading={updateTaskLoading}
        />
      )}

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

        {notes.length === 0 ? (
          <PlaceHolderCard message="No Notes Yet" />
        ) : (
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
                  onClick={async () => {
                    setDeletingNoteId(note.id)
                    try {
                      await removeNote(note.id)
                    } finally {
                      setDeletingNoteId(null)
                    }
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-white text-primary-font shadow-sm transition-all duration-300 hover:bg-redT hover:text-white"
                >
                  {deletingNoteId === note.id ? (
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
        )}
      </div>

      <button
        className="bg-redT rounded-[15px] text-md font-body py-3 text-white transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        Delete Task{" "}
      </button>
    </section>
  )
}

export default TaskDetails
