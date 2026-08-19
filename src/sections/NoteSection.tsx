import { Plus } from "lucide-react"
import { useState } from "react"
import ModalNoteCard from "../components/cards/ModalNoteCard"

type NoteSectionProps = {
  onAddNote: (note: string) => void
  notes: string[]
  onDeleteNote: (note: string) => void
}

function NoteSection({ onAddNote, notes, onDeleteNote }: NoteSectionProps) {
  const [note, setNote] = useState("")
  return (
    <>
      <textarea
        id="task-notes"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        placeholder="Add any additional notes..."
        className="resize-none rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-sm leading-6 text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />

      {/* Notes */}
      <div className="mt-2 flex flex-col gap-2 items-center justify-between ">
        {notes.map((note) => (
          <ModalNoteCard
            note={note}
            key={note}
            onDelete={onDeleteNote}
          />
        ))}
      </div>

      <button
        onClick={() => {
          onAddNote(note)
          setNote("")
        }}
        className="my-1 flex w-fit items-center gap-2 rounded-xl px-3 py-2 font-body text-sm font-medium text-primary transition-colors duration-200 hover:bg-primary/10"
      >
        <Plus className="h-4 w-4" />
        Add Note
      </button>
    </>
  )
}

export default NoteSection
