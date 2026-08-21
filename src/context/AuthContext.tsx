import { createContext } from "react"

type AuthContextType = {
  token: string
  setToken: React.Dispatch<React.SetStateAction<string>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)


