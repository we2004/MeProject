import { AuthContext } from "./AuthContext"
import { useState } from "react"

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState('')

  return (
    <AuthContext.Provider value={{token, setToken}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider