import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import { changePassword, explore, login, register } from "../api/auth"
import { useState } from "react"
import { type ChangePassword, type LogUser, type NewUser } from "../types/auth"
export function useAuth() {
  const auth = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!auth) {
    throw new Error("useAuth must be used inside AuthContextProvider")
  }

  const exploreApp = async () => {
    try {
      setLoading(true)
      const response = await explore()
      auth.setToken(response.token)
      return true
    } catch (e) {
      setError("Failed to authenticate")
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const loginApp = async (user: LogUser): Promise<boolean> => {
    try {
      setLoading(true)

      const response = await login(user)

      auth.setToken(response.token)

      return true
    } catch (error) {
      setError("Incorrect username or password")
      console.log(error)

      return false
    } finally {
      setLoading(false)
    }
  }

  const registerUser = async (newUser: NewUser) => {
    try {
      setLoading(true)

      const response = await register(newUser)
      return response
    } catch (error) {
      setError("Failed to create account")
      console.log(error)

      return null
    } finally {
      setLoading(false)
    }
  }

  const changeUserPassword = async (data: ChangePassword) => {
    try {
      setLoading(true)

      const response = await changePassword(data)

      auth.setToken(response.token)

      return true
    } catch (error) {
      setError("Incorrect username or Recovery Key")
      console.log(error)

      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    ...auth,
    exploreApp,
    loginApp,
    registerUser,
    changeUserPassword,
    loading,
    error
  }
}
