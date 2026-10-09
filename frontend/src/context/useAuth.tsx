import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import {
  changePassword,
  deleteAccount,
  explore,
  login,
  logout,
  register,
  updateName
} from "../api/auth"
import { useState } from "react"
import {
  type ChangePassword,
  type LogUser,
  type NewUser
} from "../types/auth"
export function useAuth() {
  const auth = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [logOutLoading, setLogOutLoading] = useState(false)
  const [error, setError] = useState("")

  if (!auth) {
    throw new Error("useAuth must be used inside AuthContextProvider")
  }

  const exploreApp = async () => {
    try {
      setError("")
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
      setError("")
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
      setError("")
      setLoading(true)

      const response = await register(newUser)
      return response
    } catch (error) {
      setError("Existing username or invalid password")
      console.log(error)

      return null
    } finally {
      setLoading(false)
    }
  }

  const changeUserPassword = async (data: ChangePassword) => {
    try {
      setError("")
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

  const signout = async () => {
    try {
      setError("")
      setLogOutLoading(true)
      await logout(auth.token)
    } catch (e) {
      console.log(e)
      setError("Failed to log out")
    } finally {
      auth.setToken("")
      auth.setUser(undefined)
      setLogOutLoading(false)
    }

    return true
  }

  const removeAccount = async () => {
    try {
      setError("")
      setLoading(true)
      await deleteAccount(auth.token)

      auth.setToken("")
      auth.setUser(undefined)

      return true
    } catch (e) {
      console.log(e)
      return false
    } finally {
      setLoading(false)
    }
  }

  const changeName = async (newName: string) => {
    try {
      setError("")
      setLoading(true)
      const response = await updateName(auth.token, newName)

      auth.setUser((prev) => (prev ? { ...prev, name: response.name } : prev))

      return true
    } catch (e) {
      console.log(e)
      setError("Failed to change name")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    token: auth.token,
    setToken: auth.setToken,
    user: auth.user,
    exploreApp,
    loginApp,
    logOutLoading,
    changeName,
    registerUser,
    changeUserPassword,
    removeAccount,
    signout,
    loading,
    error,
    sessionLoading: auth.sessionLoading,
    sessionError: auth.sessionError
  }
}
