import { Paperclip } from "lucide-react"
import ModalAttachmentCard from "../components/cards/ModalAttachmentCard"

type AttachmentSectionProps = {
  files: File[]
  onAddAttachment: (files: File[]) => void
  onDeleteAttachment: (file: File) =>void
}

function AttachmentSection({ files, onAddAttachment, onDeleteAttachment }: AttachmentSectionProps) {
  return (
    <>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/25 bg-primary/5 px-6 py-8 text-center transition-all duration-300 hover:border-primary/60 hover:bg-primary/10">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
          <Paperclip className="h-5 w-5" />
        </div>

        <div>
          <p className="font-body text-sm font-medium text-primary-font">
            Add project attachments
          </p>

          <p className="mt-1 font-body text-xs text-primary-font/50">
            JPG, PNG, PDF, SVG, TXT, MD
          </p>
        </div>

        <input
          type="file"
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.svg,.txt,.md"
          onChange={(e) => {
            if (e.target.files) {
              onAddAttachment(Array.from(e.target.files))
            }
          }}
        />
      </label>

      {/* Mock Attachment */}

      <div className="flex flex-col gap-1">
        {files.map((file,idx) => (
          <ModalAttachmentCard
            key={`${file.name}-${idx}`}
            file={file}
            onDelete={onDeleteAttachment}
          />
        ))}
      </div>
    </>
  )
}

export default AttachmentSection
