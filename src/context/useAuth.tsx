import { useContext } from "react"
import { AuthContext } from "./AuthContext"
import {
  changePassword,
  deleteAccount,
  explore,
  getUser,
  login,
  logout,
  register,
  updateName
} from "../api/auth"
import { useState, useEffect } from "react"
import {
  type User,
  type ChangePassword,
  type LogUser,
  type NewUser
} from "../types/auth"
export function useAuth() {
  const auth = useContext(AuthContext)
  const [user, setUser] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!auth) {
    throw new Error("useAuth must be used inside AuthContextProvider")
  }

  useEffect(() => {
    if (!auth.token) {
      return
    }

    const fetchUser = async () => {
      try {
        setError("")
        setLoading(true)
        const user = await getUser(auth.token)
        setUser(user)
      } catch (e) {
        console.log(e)
        setError("Failed to get user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [auth.token])

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
      setLoading(true)
      await logout(auth.token)
      localStorage.removeItem("token")
      auth.setToken("")
      return true
    } catch (e) {
      console.log(e)
      setError("Failed to log out")
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeAccount = async () => {
    try {
      setError("")
      setLoading(true)
      await deleteAccount(auth.token)

      localStorage.removeItem("token")
      auth.setToken("")
      setUser(undefined)

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

      setUser((prev) => (prev ? { ...prev, name: response.name } : prev))

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
    ...auth,
    user,
    exploreApp,
    loginApp,
    changeName,
    registerUser,
    changeUserPassword,
    removeAccount,
    signout,
    loading,
    error
  }
}
