import { useEffect, useState } from "react"
import { Download, ExternalLink, X } from "lucide-react"
import Spinner from "../loading/spinners/Spinner"
import { downloadAttachment } from "../../api/attachments"
import { type AttachemntsTypes } from "../../types/attachments"

type AttachmentPreviewModalProps = {
  token: string
  id: number
  name: string
  type: AttachemntsTypes
  onClose: () => void
  onDownload: (attachmentId: number, fileName: string) => void
}

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

const MAX_TEXT_CHARS = 200000
const SMALL_SCREEN_QUERY = "(max-width: 767px), (pointer: coarse)"

function AttachmentPreviewModal({
  token,
  id,
  name,
  type,
  onClose,
  onDownload
}: AttachmentPreviewModalProps) {
  const [url, setUrl] = useState<string | null>(null)
  const [text, setText] = useState<string | null>(null)
  const [truncated, setTruncated] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const isImage = type === "png" || type === "jpg" || type === "jpeg" || type === "svg"
  const isPdf = type === "pdf"
  const isSmallScreen = window.matchMedia(SMALL_SCREEN_QUERY).matches

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    const load = async () => {
      try {
        const data = await downloadAttachment(token, id)
        const file = new Blob([data], { type: MIME_TYPES[type] })

        if (cancelled) return

        if (type === "md" || type === "txt") {
          const content = await file.text()
          if (cancelled) return
          setTruncated(content.length > MAX_TEXT_CHARS)
          setText(content.slice(0, MAX_TEXT_CHARS))
        } else {
          objectUrl = URL.createObjectURL(file)
          setUrl(objectUrl)
        }
        setBlob(file)
      } catch {
        if (!cancelled) setError("Could not load this file.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [token, id, type])

  const handleOpenInNewTab = () => {
    if (!blob) return
    const tabUrl = URL.createObjectURL(blob)
    window.open(tabUrl, "_blank")
    setTimeout(() => URL.revokeObjectURL(tabUrl), 60000)
  }

  return (
    <div
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-80 flex items-center justify-center bg-primary-font/30 px-3 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-primary/15 bg-white p-4 shadow-xl md:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="min-w-0 truncate font-heading text-lg font-bold text-primary-font md:text-2xl">
            {name}
          </h2>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => onDownload(id, name)}
              className="rounded-xl p-2 text-primary-font/70 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-primary-font/60 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-2xl border border-primary/10 bg-primary/5">
          {loading ? (
            <div className="py-16">
              <Spinner size="sm" color="dark" />
            </div>
          ) : error ? (
            <p className="px-4 py-16 text-center font-body text-sm text-primary-font/60">
              {error}
            </p>
          ) : isImage && url ? (
            <img
              src={url}
              alt={name}
              className="max-h-[70vh] max-w-full object-contain"
            />
          ) : isPdf && url ? (
            isSmallScreen ? (
              <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
                <p className="font-body text-sm text-primary-font/60">
                  PDFs can't be previewed inline on this device.
                </p>
                <button
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-body text-sm text-white transition-all duration-300 hover:shadow-md"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open PDF
                </button>
              </div>
            ) : (
              <iframe
                src={url}
                title={name}
                className="h-[70vh] w-full"
              />
            )
          ) : text !== null ? (
            <div className="h-full max-h-[70vh] w-full self-start overflow-auto p-4">
              <pre className="whitespace-pre-wrap break-words font-body text-sm text-primary-font">
                {text}
              </pre>
              {truncated && (
                <p className="mt-3 font-body text-xs text-primary-font/50">
                  Preview truncated. Download the file to see everything.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default AttachmentPreviewModal
