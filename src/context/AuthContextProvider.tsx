import { AuthContext } from "./AuthContext"
import { useState } from "react"

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState(
    () => localStorage.getItem("token") ?? ""
  )

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken)
    setTokenState(newToken)
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
