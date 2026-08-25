import Modal from "./Modal"
import AttachmentSection from "../../sections/AttachmentSection"
import { useState } from "react"
type AddAttachmentModalProps = {
  onClose: () => void
  onSubmit: (files: File[]) => Promise<boolean>
  addAttachmentLoading: boolean
}
function AddAttachmentModal({
  onClose,
  onSubmit,
  addAttachmentLoading
}: AddAttachmentModalProps) {
  const [files, setFiles] = useState<File[]>([])

  const handleAddAttachment = (newFiles: File[]) => {
    setFiles((current) => [...current, ...newFiles])
  }

  const handleDeleteFile = (file: File) => {
    setFiles((current) => current.filter((currentFile) => currentFile !== file))
  }

  return (
    <Modal
      modalTitle="Add Attachments"
      onClose={onClose}
      onSubmit={async () => {
        const success = await onSubmit(files)
        if (success) onClose()
      }}
      loading={addAttachmentLoading}
    >
      <AttachmentSection
        onAddAttachment={handleAddAttachment}
        onDeleteAttachment={handleDeleteFile}
        files={files}
      />
    </Modal>
  )
}

export default AddAttachmentModal
