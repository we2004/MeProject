import { useState, useEffect, useRef, useCallback } from "react"
import { downloadAttachment } from "../api/attachments"
import type { AttachemntsTypes, AttachmentFile } from "../types/attachments"

// The server's content type can be generic, so the type is derived from the extension
const MIME_TYPES: Record<AttachemntsTypes, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  md: "text/plain",
  txt: "text/plain"
}

const MAX_CONCURRENT = 3
const MAX_TEXT_CHARS = 200000

type Job = { id: number; type: AttachemntsTypes }

function withoutFile(files: Record<number, AttachmentFile>, id: number) {
  const next = { ...files }
  delete next[id]
  return next
}

function useAttachmentFiles(token: string, projectId: number) {
  const [files, setFiles] = useState<Record<number, AttachmentFile>>({})
  const queue = useRef<Job[]>([])
  const activeCount = useRef(0)
  const requested = useRef(new Set<number>())
  const urls = useRef(new Map<number, string>())

  const load = useCallback(
    async ({ id, type }: Job) => {
      try {
        const data = await downloadAttachment(token, id)
        const blob = new Blob([data], { type: MIME_TYPES[type] })

        if (!requested.current.has(id)) return

        if (type === "md" || type === "txt") {
          const content = await blob.text()
          if (!requested.current.has(id)) return

          setFiles((prev) => ({
            ...prev,
            [id]: {
              status: "ready",
              blob,
              text: content.slice(0, MAX_TEXT_CHARS),
              truncated: content.length > MAX_TEXT_CHARS
            }
          }))
        } else {
          const url = URL.createObjectURL(blob)
          urls.current.set(id, url)

          setFiles((prev) => ({
            ...prev,
            [id]: { status: "ready", blob, url }
          }))
        }
      } catch {
        if (!requested.current.has(id)) return

        requested.current.delete(id)
        setFiles((prev) => ({ ...prev, [id]: { status: "error" } }))
      }
    },
    [token]
  )

  // A worker keeps taking queued jobs until the concurrency limit is exceeded
  const runJob = useCallback(
    async (first: Job) => {
      activeCount.current++

      let job: Job | undefined = first
      while (job) {
        await load(job)
        job =
          activeCount.current <= MAX_CONCURRENT
            ? queue.current.shift()
            : undefined
      }

      activeCount.current--
    },
    [load]
  )

  // priority is for user-initiated loads (opening a file), which skip the queue
  const request = useCallback(
    (id: number, type: AttachemntsTypes, priority = false) => {
      const job = { id, type }

      if (requested.current.has(id)) {
        const queuedIndex = queue.current.findIndex((item) => item.id === id)
        if (priority && queuedIndex !== -1) {
          queue.current.splice(queuedIndex, 1)
          runJob(job)
        }
        return
      }

      requested.current.add(id)
      setFiles((prev) => ({ ...prev, [id]: { status: "loading" } }))

      if (priority || activeCount.current < MAX_CONCURRENT) {
        runJob(job)
      } else {
        queue.current.push(job)
      }
    },
    [runJob]
  )

  // Only requests that haven't started yet are dropped
  const cancel = useCallback((id: number) => {
    const queuedIndex = queue.current.findIndex((item) => item.id === id)
    if (queuedIndex === -1) return

    queue.current.splice(queuedIndex, 1)
    requested.current.delete(id)
    setFiles((prev) => withoutFile(prev, id))
  }, [])

  const removeFile = useCallback((id: number) => {
    queue.current = queue.current.filter((item) => item.id !== id)
    requested.current.delete(id)

    const url = urls.current.get(id)
    if (url) {
      URL.revokeObjectURL(url)
      urls.current.delete(id)
    }

    setFiles((prev) => withoutFile(prev, id))
  }, [])

  useEffect(() => {
    const pendingRequests = requested.current
    const pendingUrls = urls.current

    return () => {
      queue.current = []
      pendingRequests.clear()
      pendingUrls.forEach((url) => URL.revokeObjectURL(url))
      pendingUrls.clear()
      setFiles({})
    }
  }, [token, projectId])

  return { files, request, cancel, removeFile }
}

export default useAttachmentFiles
