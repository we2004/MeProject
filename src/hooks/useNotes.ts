import { useState, useEffect } from "react"
import type { NoteApiResonse } from "../types/notes"
import { getNotesByTask, createNote, deleteNote } from "../api/notes"

function useNotes(token: string, taskId: number) {
  const [notes, setNotes] = useState<NoteApiResonse[]>([])
  const [notesLoading, setNotesLoading] = useState(false)
  const [addNoteLoading, setAddNoteLoading] = useState(false)
  const [removeNoteLoading, setRemoveNoteLoading] = useState(false)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const fetchNotesData = async () => {
      try {
        setNotesLoading(true)
        const taskNotes = await getNotesByTask(taskId, token)

        setNotes(taskNotes)
      } catch (e) {
        setError("Failed to fetch notes")
        console.log(e)
      } finally {
        setNotesLoading(false)
      }
    }

    fetchNotesData()
  }, [token, taskId])

  const addNote = async (notes: string[]) => {
    try {
      setAddNoteLoading(true)
      for (const content of notes) {
        await createNote(token, { content: content, taskId: taskId })
      }

      const updatedNotes = await getNotesByTask(taskId, token)
      setNotes(updatedNotes)
      return true
    } catch (e) {
      setError("Failed to add note")
      console.log(e)
      return false
    } finally {
      setAddNoteLoading(false)
    }
  }

  const removeNote = async (noteId: number) => {
    try {
      setRemoveNoteLoading(true)
      await deleteNote(token, noteId)

      const updatedNotes = await getNotesByTask(taskId, token)
      setNotes(updatedNotes)
      return true
    } catch (e) {
      setError("Failed to remove note")
      console.log(e)
      return false
    } finally {
      setRemoveNoteLoading(false)
    }
  }

  return {
    notes,
    notesLoading,
    addNoteLoading,
    removeNoteLoading,
    error,
    addNote,
    removeNote
  }
}

export default useNotes
