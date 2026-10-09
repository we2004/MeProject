import { useEffect, useRef } from "react"
import { Download, ExternalLink, RotateCw, X } from "lucide-react"
import Spinner from "../loading/spinners/Spinner"
import { type AttachemntsTypes, type AttachmentFile } from "../../types/attachments"

type AttachmentPreviewModalProps = {
  id: number
  name: string
  type: AttachemntsTypes
  file?: AttachmentFile
  onRequest: (attachmentId: number, type: AttachemntsTypes, priority?: boolean) => void
  onClose: () => void
  onDownload: (attachmentId: number, fileName: string) => void
}

const SMALL_SCREEN_QUERY = "(max-width: 767px), (pointer: coarse)"

function AttachmentPreviewModal({
  id,
  name,
  type,
  file,
  onRequest,
  onClose,
  onDownload
}: AttachmentPreviewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const isImage = type === "png" || type === "jpg" || type === "jpeg" || type === "svg"
  const isPdf = type === "pdf"
  const isSmallScreen = window.matchMedia(SMALL_SCREEN_QUERY).matches
  const loading = !file || file.status === "loading"
  const url = file?.url
  const text = file?.text

  // Opening a file reuses the cached copy, or fetches it ahead of the queue
  useEffect(() => {
    onRequest(id, type, true)
  }, [id, type, onRequest])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    return () => previouslyFocused?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleOpenInNewTab = () => {
    if (!file?.blob) return
    const tabUrl = URL.createObjectURL(file.blob)
    window.open(tabUrl, "_blank")
    setTimeout(() => URL.revokeObjectURL(tabUrl), 60000)
  }

  return (
    <div
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-80 flex items-center justify-center bg-primary-font/30 px-3 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={name}
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
              aria-label={`Download ${name}`}
              className="rounded-xl p-2 text-primary-font/70 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close preview"
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
          ) : file?.status === "error" ? (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <p className="font-body text-sm text-primary-font/60">
                Could not load this file.
              </p>
              <button
                onClick={() => onRequest(id, type, true)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-body text-sm text-white transition-all duration-300 hover:shadow-md"
              >
                <RotateCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          ) : isImage && url ? (
            <img
              src={url}
              alt={`Full-size preview of ${name}`}
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
          ) : text !== undefined ? (
            <div className="h-full max-h-[70vh] w-full self-start overflow-auto p-4">
              <pre className="whitespace-pre-wrap break-words text-start font-body text-sm text-primary-font">
                {text}
              </pre>
              {file?.truncated && (
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
