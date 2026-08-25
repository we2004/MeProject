import { AlertTriangle, Trash2 } from "lucide-react"
import SecondaryButton from "../buttons/SecondaryButton"
import Spinner from "../loading/spinners/Spinner"

type DeleteModalProps = {
  onCancel: () => void
  onDelete: () => Promise<void>
  title: string
  message: string
  btnText: string
  loading: boolean
}

function DeleteModal({
  onCancel,
  onDelete,
  title,
  message,
  btnText,
  loading
}: DeleteModalProps) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-font/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-red-900/10 bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-900/10 text-red-900">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <h2 className="font-heading text-xl font-bold text-primary-font">
              {title}
            </h2>
          </div>
        </div>

        {/* Message */}

        <p className="mt-8 font-body text-sm leading-6 text-primary-font/60">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-7 flex gap-3 md:flex-row md:justify-end">
          <SecondaryButton
            onClickFun={onCancel}
            disabled={loading}
          >
            Cancel
          </SecondaryButton>

          <SecondaryButton
            Icon={Trash2}
            bgColor="bg-redT text-white"
            bgHoverColor="bg-redT"
            onClickFun={onDelete}
            disabled={loading}
          >
            {loading ? (
              <Spinner
                size="sm"
                color="light"
              />
            ) : (
              btnText
            )}
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
