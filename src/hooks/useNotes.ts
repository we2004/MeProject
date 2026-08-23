import { useState, useEffect } from "react"
import type { NoteApiResonse } from "../types/notes"
import { getNotesByTask, createNote, deleteNote } from "../api/notes"

function useNotes(token: string, taskId: number) {
  const [notes, setNotes] = useState<NoteApiResonse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const fetchNotesData = async () => {
      try {
        setLoading(true)
        const taskNotes = await getNotesByTask(taskId, token)

        setNotes(taskNotes)
      } catch (e) {
        setError("Failed to fetch notes")
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    fetchNotesData()
  }, [token, taskId])

  const addNote = async (notes: string[]) => {
    for (const content of notes) {
      await createNote(token, { content: content, taskId: taskId })
    }

    const updatedNotes = await getNotesByTask(taskId, token)
    setNotes(updatedNotes)
  }

  const removeNote = async (noteId: number) => {
    await deleteNote(token, noteId)

    const updatedNotes = await getNotesByTask(taskId, token)
    setNotes(updatedNotes)
  }

  return { notes, loading, error, addNote, removeNote }
}

export default useNotes
