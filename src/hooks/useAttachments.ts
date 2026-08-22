import { useState, useEffect } from "react"
import type { AttachmentApiResponse } from "../types/attachments"
import { getAttachments, createAttachment, deleteAttachment } from "../api/attachments"

function useAttachments(token: string, projectId: number) {
  const [attachments, setAttachments] = useState<AttachmentApiResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  //GET attachments
  useEffect(() => {
    const handleFetchAttachments = async () => {
      try {
        setLoading(true)
        const attachmentsData = await getAttachments(projectId, token)
        setAttachments(attachmentsData)
      } catch (e) {
        setError("Failed to fetch attachments")
      } finally {
        setLoading(false)
      }
    }
    handleFetchAttachments()
  },[token, projectId])

  const addAttachment = async (files: File[]) => {
    try {
      setLoading(true)
      for (const file of files) {
        await createAttachment(token, {
          file: file,
          projectId: projectId
        })
      }

      const updatedAttachments = await getAttachments(projectId, token)

      setAttachments(updatedAttachments)
    } catch (e) {
      setError("Failed to add attachment")
    } finally {
      setLoading(false)
    }
  }

  const removeAttachment = async (fileId: number) => {
    try {
      setLoading(true)
      await deleteAttachment(token, fileId)

      const updatedAttachments = await getAttachments(projectId, token)
      setAttachments(updatedAttachments)
    } catch (e) {
      setError("Failed to delete attachment")
    } finally {
      setLoading(false)
    }
  }

  return { attachments, loading, error, addAttachment, removeAttachment }
}

export default useAttachments
