import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { AttachmentApiResponse } from "../types/attachments"
import {
  getAttachments,
  createAttachment,
  deleteAttachment
} from "../api/attachments"

function useAttachments(token: string, projectId: number) {
  const queryClient = useQueryClient()
  const [addAttachmentLoading, setAddAttachmentLoading] = useState(false)
  const [removeAttachmentLoading, setRemoveAttachmentLoading] = useState(false)
  const [mutationError, setMutationError] = useState("")

  const attachmentsQuery = useQuery<AttachmentApiResponse[]>({
    queryKey: ["attachments", token, projectId],
    queryFn: () => getAttachments(projectId, token),
    enabled: Boolean(token && projectId)
  })

  const addAttachment = async (files: File[]) => {
    try {
      setMutationError("")
      setAddAttachmentLoading(true)
      for (const file of files) {
        await createAttachment(token, { file, projectId })
      }

      await queryClient.invalidateQueries({
        queryKey: ["attachments", token, projectId]
      })
      return true
    } catch (e) {
      await queryClient.invalidateQueries({
        queryKey: ["attachments", token, projectId]
      })
      setMutationError("Failed to add attachment")
      console.log(e)
      return false
    } finally {
      setAddAttachmentLoading(false)
    }
  }

  const removeAttachment = async (fileId: number) => {
    try {
      setMutationError("")
      setRemoveAttachmentLoading(true)
      await deleteAttachment(token, fileId)

      queryClient.removeQueries({
        queryKey: ["attachmentFile", token, projectId, fileId]
      })
      await queryClient.invalidateQueries({
        queryKey: ["attachments", token, projectId]
      })
      return true
    } catch (e) {
      setMutationError("Failed to delete attachment")
      console.log(e)
      return false
    } finally {
      setRemoveAttachmentLoading(false)
    }
  }

  return {
    attachments: attachmentsQuery.data ?? [],
    attachmentLoading: attachmentsQuery.isLoading,
    attachmentsHasData: attachmentsQuery.data !== undefined,
    addAttachmentLoading,
    removeAttachmentLoading,
    error: attachmentsQuery.isError
      ? "Failed to fetch attachments"
      : mutationError,
    addAttachment,
    removeAttachment
  }
}

export default useAttachments
