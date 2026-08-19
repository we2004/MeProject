import { FilePlus2, X } from "lucide-react"

type ModalAttachmentCard = {
  file: File
  onDelete: (file: File) => void
}
function ModalAttachmentCard({ file, onDelete }: ModalAttachmentCard) {
  
  return (
    <div className="mt-2 flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <FilePlus2 className="h-5 w-5 text-primary" />

        <span className="font-body text-sm text-primary-font">{file.name}</span>
      </div>

      <button
        onClick={() => onDelete(file)}
        className="rounded-lg p-1.5 text-primary-font/50 transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default ModalAttachmentCard
