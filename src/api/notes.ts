import axios from "axios"
import type { Note } from "../types/notes"

const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getNotesByTask(taskId: number, token: string) {
  const response = await axios.get(`${BASE_URL}/tasks/${taskId}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export async function getNoteById(noteId: number, token: string) {
  const response = await axios.get(`${BASE_URL}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export async function createNote(token: string, newNote: Note) {
  const response = await axios.post(`${BASE_URL}/notes`, newNote, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}


export async function deleteNote(token: string, noteId: number) {
  const response = await axios.delete(`${BASE_URL}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
