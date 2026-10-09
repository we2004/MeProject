import { AuthContext } from "./AuthContext"
import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import { getUser } from "../api/auth"
import type { User } from "../types/auth"
import { useQueryClient } from "@tanstack/react-query"

type SessionRequest = {
  token: string
  promise: Promise<User>
}

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setTokenState] = useState(
    () => localStorage.getItem("token") ?? ""
  )
  const [user, setUser] = useState<User | undefined>(undefined)
  const [sessionLoading, setSessionLoading] = useState(Boolean(token))
  const [sessionError, setSessionError] = useState("")
  const sessionRequest = useRef<SessionRequest | null>(null)
  const currentToken = useRef(token)

  const setToken = useCallback((newToken: string) => {
    if (currentToken.current !== newToken) {
      queryClient.clear()
    }
    currentToken.current = newToken
    if (newToken) {
      localStorage.setItem("token", newToken)
    } else {
      localStorage.removeItem("token")
    }
    setUser(undefined)
    setSessionError("")
    setSessionLoading(Boolean(newToken))
    setTokenState(newToken)
  }, [queryClient])

  useEffect(() => {
    if (!token) return

    let active = true
    let request = sessionRequest.current
    if (!request || request.token !== token) {
      request = { token, promise: getUser(token) }
      sessionRequest.current = request
    }

    request.promise
      .then((sessionUser) => {
        if (active && currentToken.current === token) setUser(sessionUser)
      })
      .catch((error: unknown) => {
        if (!active || currentToken.current !== token) return

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setToken("")
          return
        }

        console.error(error)
        setSessionError("Failed to get user data")
      })
      .finally(() => {
        if (sessionRequest.current === request) sessionRequest.current = null
        if (active && currentToken.current === token) setSessionLoading(false)
      })

    return () => {
      active = false
    }
  }, [token, setToken])

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        sessionLoading,
        sessionError,
        setSessionError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
