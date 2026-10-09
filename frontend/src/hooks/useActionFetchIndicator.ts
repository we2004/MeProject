import { useCallback, useEffect, useState } from "react"

function useActionFetchIndicator(isFetching: boolean) {
  const [actionPending, setActionPending] = useState(false)

  useEffect(() => {
    if (!actionPending || isFetching) return

    const timeout = window.setTimeout(() => setActionPending(false), 100)
    return () => window.clearTimeout(timeout)
  }, [actionPending, isFetching])

  const startAction = useCallback(() => setActionPending(true), [])

  return {
    isActionFetching: actionPending && isFetching,
    startAction
  }
}

export default useActionFetchIndicator
