import axios from "axios"

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data
    if (responseData && typeof responseData === "object") {
      const message = (responseData as Record<string, unknown>).error
      if (typeof message === "string" && message.trim()) return message
    }
  }

  return fallback
}