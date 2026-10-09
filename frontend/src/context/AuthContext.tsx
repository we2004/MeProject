import { createContext } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { User } from "../types/auth"

type AuthContextType = {
  token: string
  setToken: (token: string) => void
  user: User | undefined
  setUser: Dispatch<SetStateAction<User | undefined>>
  sessionLoading: boolean
  sessionError: string
  setSessionError: (error: string) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
