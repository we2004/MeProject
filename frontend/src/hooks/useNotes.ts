import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { NoteApiResonse } from "../types/notes"
import { getNotesByTask, createNote, deleteNote } from "../api/notes"

function useNotes(token: string, taskId: number) {
  const queryClient = useQueryClient()
  const [addNoteLoading, setAddNoteLoading] = useState(false)
  const [removeNoteLoading, setRemoveNoteLoading] = useState(false)
  const [mutationError, setMutationError] = useState("")

  const notesQuery = useQuery<NoteApiResonse[]>({
    queryKey: ["notes", token, taskId],
    queryFn: () => getNotesByTask(taskId, token),
    enabled: Boolean(token && taskId)
  })

  const addNote = async (notes: string[]) => {
    try {
      setMutationError("")
      setAddNoteLoading(true)
      for (const content of notes) {
        await createNote(token, { content: content, taskId })
      }

      await queryClient.invalidateQueries({ queryKey: ["notes", token, taskId] })
      return true
    } catch (e) {
      await queryClient.invalidateQueries({ queryKey: ["notes", token, taskId] })
      setMutationError("Failed to add note")
      console.log(e)
      return false
    } finally {
      setAddNoteLoading(false)
    }
  }

  const removeNote = async (noteId: number) => {
    try {
      setMutationError("")
      setRemoveNoteLoading(true)
      await deleteNote(token, noteId)

      await queryClient.invalidateQueries({ queryKey: ["notes", token, taskId] })
      return true
    } catch (e) {
      setMutationError("Failed to remove note")
      console.log(e)
      return false
    } finally {
      setRemoveNoteLoading(false)
    }
  }

  return {
    notes: notesQuery.data ?? [],
    notesLoading: notesQuery.isLoading,
    notesHasData: notesQuery.data !== undefined,
    addNoteLoading,
    removeNoteLoading,
    error: notesQuery.isError
      ? "Failed to fetch notes"
      : mutationError,
    addNote,
    removeNote
  }
}

export default useNotes
