import {
  Trash2,
  CirclePlus,
} from "lucide-react"

import { useNavigate, useParams } from "react-router-dom"
import NoteCard from "../components/cards/NoteCard"
import PrimaryButton from "../components/buttons/PrimaryButton"
import AddNoteModal from "../components/modals/AddNoteModal"
import { useState } from "react"
import { deleteTask } from "../api/tasks"
import { useAuth } from "../context/useAuth"
import useTask from "../hooks/useTask"
import useNotes from "../hooks/useNotes"
import useProject from "../hooks/useProject"
import TaskInfoSection from "../sections/TaskInfoSection"

function TaskDetails() {
  const { token } = useAuth()
  const { taskId } = useParams()
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const {
    task,

    updateTask
  } = useTask(token, Number(taskId))

  const {
    notes,
    addNote,
    removeNote
  } = useNotes(token, Number(taskId))

  const { project } = useProject(token, task?.projectId)

 
  const navigate = useNavigate()

  if (!task || !project) {
    return <p>Task not found</p>
  }

  const handleDeleteTask = async () => {
    await deleteTask(Number(taskId), token)
    navigate("/tasks")
  }

  if (!notes) return <p>something is wrong</p>

  return (
    <section className="flex flex-col gap-8">
      {/* Task Information */}

      {isNoteModalOpen && (
        <AddNoteModal
          onClose={() => setIsNoteModalOpen(false)}
          onSubmit={addNote}
        />
      )}

      <TaskInfoSection onUpdate={updateTask} task={task} projectName={project.name} />

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
                onClick={() => removeNote(note.id)}
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
        onClick={handleDeleteTask}
      >
        Delete Task{" "}
      </button>
    </section>
  )
}

export default TaskDetails
