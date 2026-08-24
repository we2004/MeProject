import { useState, useEffect } from "react"
import type { AttachmentApiResponse } from "../types/attachments"
import {
  getAttachments,
  createAttachment,
  deleteAttachment
} from "../api/attachments"

function useAttachments(token: string, projectId: number) {
  const [attachments, setAttachments] = useState<AttachmentApiResponse[]>([])
  const [attachmentLoading, setAttachmentLoading] = useState(false)
  const [addAttachmentLoading, setAddAttachmentLoading] = useState(false)
  const [removeAttachmentLoading, setRemoveAttachmentLoading] = useState(false)
  const [error, setError] = useState("")

  //GET attachments
  useEffect(() => {
    const handleFetchAttachments = async () => {
      try {
        setAttachmentLoading(true)
        const attachmentsData = await getAttachments(projectId, token)
        setAttachments(attachmentsData)
      } catch (e) {
        setError("Failed to fetch attachments")
        console.log(e)
      } finally {
        setAttachmentLoading(false)
      }
    }
    handleFetchAttachments()
  }, [token, projectId])

  const addAttachment = async (files: File[]) => {
    try {
      setAddAttachmentLoading(true)
      for (const file of files) {
        await createAttachment(token, {
          file: file,
          projectId: projectId
        })
      }

      const updatedAttachments = await getAttachments(projectId, token)

      setAttachments(updatedAttachments)
      return true
    } catch (e) {
      setError("Failed to add attachment")
      console.log(e)
      return false
    } finally {
      setAddAttachmentLoading(false)
    }
  }

  const removeAttachment = async (fileId: number) => {
    try {
      setRemoveAttachmentLoading(true)
      await deleteAttachment(token, fileId)

      const updatedAttachments = await getAttachments(projectId, token)
      setAttachments(updatedAttachments)
      return true

    } catch (e) {
      console.log(e)
      setError("Failed to delete attachment")

      return false
    } finally {
      setRemoveAttachmentLoading(false)
    }
  }

  return {
    attachments,
    attachmentLoading,
    addAttachmentLoading,
    removeAttachmentLoading,
    error,
    addAttachment,
    removeAttachment
  }
}

export default useAttachments
