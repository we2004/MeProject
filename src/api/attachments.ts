import axios from "axios"
const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getAttachments(projectId: number, token:string) {
  const response = await axios.get(`${BASE_URL}/projects/${projectId}/attachments`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
