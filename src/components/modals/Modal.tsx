import { X } from "lucide-react"
import PrimaryButton from "../buttons/PrimaryButton"
import Spinner from "../loading/spinners/Spinner"

type ModalProps = {
  onClose: () => void
  children: React.ReactNode
  modalTitle: string
  modalDescription?: string
  onSubmit: () => Promise<void>
  loading: boolean
}
function Modal({
  onClose,
  children,
  modalTitle,
  modalDescription,
  onSubmit,
  loading
}: ModalProps) {
  
  return (
    <div className="animate-fade-in fixed inset-0 z-80 flex items-center justify-center bg-primary-font/30 px-3 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-primary/15 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary-font">
              {modalTitle}
            </h2>

            {modalDescription && (
              <p className="mt-1 font-body text-sm text-primary-font/60">
                {modalDescription}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-primary-font/60 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-7">{children}</div>

        <div className="flex justify-end border-t border-primary/10 pt-6 ">
          <PrimaryButton
            onClickFun={onSubmit}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" color="light" /> : "Add"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default Modal
