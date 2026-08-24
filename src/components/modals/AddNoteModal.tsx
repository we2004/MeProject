import { useState } from "react"
import NoteSection from "../../sections/NoteSection"
import Modal from "./Modal"
type AddNoteModal = {
  onClose: () => void
  onSubmit: (notes: string[]) => Promise<boolean>
}
function AddNoteModal({ onClose, onSubmit }: AddNoteModal) {
  const [notes, setNotes] = useState<string[]>([])

  const handleAddNote = (note: string) => {
    if (!note.trim()) return
    setNotes((currentNotes) => [...currentNotes, note])
  }

  const handleDeleteNote = (note: string) => {
    const newNotes = [...notes]
    newNotes.splice(newNotes.indexOf(note), 1)
    setNotes(newNotes)
  }

  return (
    <Modal
      modalTitle="Add Notes"
      onClose={onClose}
      onSubmit={async () => {
        const success = await onSubmit(notes)
        if (success) onClose()
      }}
    >
      <NoteSection
        onAddNote={handleAddNote}
        notes={notes}
        onDeleteNote={handleDeleteNote}
      />
    </Modal>
  )
}

export default AddNoteModal
