import axios from "axios"
import type { CreateAttachment } from "../types/attachments"
const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getAttachments(projectId: number, token: string) {
  const response = await axios.get(
    `${BASE_URL}/projects/${projectId}/attachments`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export async function createAttachment(
  token: string,
  newAttachment: CreateAttachment
) {
  const formData = new FormData()

  formData.append("file", newAttachment.file)
  formData.append("projectId", String(newAttachment.projectId))

  const response = await axios.post(`${BASE_URL}/attachments`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export async function deleteAttachment(token: string, fileId: number) {
  const response = await axios.delete(`${BASE_URL}/attachments/${fileId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export async function downloadAttachment(token:string, fileId: number) {
  const response = await axios.get(
    `${BASE_URL}/attachments/${fileId}/download`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: "blob"
    }
  )

  return response.data
}
