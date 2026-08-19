
export type AttachemntsTypes = "png" | "jpg" | "jpeg" |"svg" | "pdf" | "md" | "txt"

export type AttachmentCardProps = {
  type: AttachemntsTypes
  name: string
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