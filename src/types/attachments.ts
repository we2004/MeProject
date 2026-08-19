
export type AttachemntsTypes = "png" | "jpg" | "jpeg" |"svg" | "pdf" | "md" | "txt"

export type AttachmentCardProps = {
  mimeType: AttachemntsTypes
  fileName: string
}

export type AttachmentApiResponse = {
    id: number
    fileName: string
    mimeType: AttachemntsTypes
    projectId: number
    sizeBytes: number
}