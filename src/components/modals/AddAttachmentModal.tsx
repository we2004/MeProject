import Modal from "./Modal"
import AttachmentSection from "../../sections/AttachmentSection"
type AddAttachmentModalProps = {
  onClose: () => void
}
function AddAttachmentModal({ onClose }: AddAttachmentModalProps) {
  const files = ["requirments", "ui/ux"]

  return (
    <Modal
      modalTitle="Add Attachments"
      onClose={onClose}
    >
      <AttachmentSection files={files} />
    </Modal>
  )
}

export default AddAttachmentModal
