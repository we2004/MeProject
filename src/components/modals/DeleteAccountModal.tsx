import { AlertTriangle, Trash2} from "lucide-react"
import SecondaryButton from "../buttons/SecondaryButton"

type DeleteAccountModalProps = {
  onCancel: () => void
  onDelete:  () => Promise<void>
}

function DeleteAccountModal({ onCancel, onDelete }: DeleteAccountModalProps) {
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
              Delete Account
            </h2>
          </div>
        </div>

        {/* Message */}
        <div className="mt-6">
          <p className="font-body leading-6 text-primary-font/70">
            Are you sure you want to delete your account?
          </p>

          <p className="mt-2 font-body text-sm leading-6 text-primary-font/60">
            This action cannot be undone. Your account and all associated
            projects, tasks, notes, and attachments will be permanently deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <SecondaryButton onClickFun={onCancel}>Cancel</SecondaryButton>

          <SecondaryButton
            Icon={Trash2}
            bgColor="bg-redT text-white"
            bgHoverColor="bg-redT"
            onClickFun={onDelete}
          >
            Delete Account
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountModal
