import Spinner from "./loading/spinners/Spinner"

type UpdatingIndicatorProps = {
  active: boolean
  message: string
}

function UpdatingIndicator({ active, message }: UpdatingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="ms-0 flex h-6 w-6 items-center justify-center sm:ms-1 md:ms-1 lg:ms-2 xl:ms-2 2xl:ms-2"
    >
      {active && (
        <>
          <Spinner size="sm" color="dark" />
          <span className="sr-only">{message}</span>
        </>
      )}
    </div>
  )
}

export default UpdatingIndicator
