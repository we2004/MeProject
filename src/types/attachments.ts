
export type AttachemntsTypes = "png" | "jpg" | "jpeg" |"svg" | "pdf" | "md" | "txt"

export type AttachmentCardProps = {
  id: number
  type: AttachemntsTypes
  name: string
  onDownload: (attachmentId: number,
    fileName: string) => void
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