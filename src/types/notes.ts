export type Note = {
  content: string
  taskId: number
}

export type NoteApiResonse = Note & {
  id: number
  createdAt: string
}

export type NoteCardProps = {
  content: string
  createdAt: string
}
