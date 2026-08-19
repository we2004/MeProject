
export type AttachemntsTypes = "png" | "jpg" | "svg" | "pdf" | "md" | "txt" | "link"

export type AttachmentCardProps = {
  type: AttachemntsTypes
  name: string
}

export type Attachment = {
    id: number
    name: string
    type: AttachemntsTypes
    projectId: number
}