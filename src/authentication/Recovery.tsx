import { CheckCircle2, ShieldAlert } from "lucide-react"
import { Link } from "react-router-dom"


function Recovery() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-lightBodyBackground px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-primary/15 bg-white p-6 shadow-lg sm:p-8">
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-greenT/40 text-white">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-primary-font">
            Account Created
          </h1>
        </div>

        {/* Recovery Key */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="recovery-key"
            className="font-body text-sm font-medium text-primary-font"
          >
            Your Recovery Key
          </label>

          <input
            id="recovery-key"
            type="text"
            value="MP-7K4X-92QF-8L2M"
            disabled
            readOnly
            className="w-full rounded-2xl border border-primary/15 bg-primary/5 py-3.5 px-4 font-body text-sm font-medium tracking-wider text-primary-font disabled:opacity-100"
          />
        </div>

        {/* Warning */}
        <div className="mt-5 flex gap-3 rounded-2xl border border-red-900/10 bg-redT/15 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-redT" />

          <p className="font-body text-sm leading-6 text-primary-font/70">
            Keep this key somewhere safe. If you lose your recovery key, you
            will not be able to recover your account.
          </p>
        </div>

        {/* OK */}

        <div className="w-full flex justify-center mt-8">
          <Link to='/home' className="w-30 rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-primary-font text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md hover:bg-secondary hover:text-white">
            OK
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Recovery
