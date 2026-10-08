
export type AttachemntsTypes = "png" | "jpg" | "jpeg" |"svg" | "pdf" | "md" | "txt"

export type AttachmentFile = {
  status: "loading" | "ready" | "error"
  blob?: Blob
  url?: string
  text?: string
  truncated?: boolean
}

export type AttachmentCardProps = {
  id: number
  type: AttachemntsTypes
  name: string
  file?: AttachmentFile
  deleting: boolean
  onDownload: (attachmentId: number,
    fileName: string) => void
  onView: (attachmentId: number) => void
  onDelete: (attachmentId: number) => void
  onRequest: (attachmentId: number, type: AttachemntsTypes, priority?: boolean) => void
  onCancel: (attachmentId: number) => void
}

export type AttachmentApiResponse = {
    id: number
    name: string
    projectId: number
    type: AttachemntsTypes
}

export type CreateAttachment = {
  file: File
  projectId: number
}