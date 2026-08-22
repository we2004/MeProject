const BASE_URL = import.meta.env.VITE_BASE_URL
import axios from "axios"
import type { ChangePassword, LogUser, NewUser } from "../types/auth"

export async function register(newUser: NewUser) {
  const response = await axios.post(`${BASE_URL}/auth/register`, newUser)

  return response.data
}

export async function login(logUser: LogUser) {
  const response = await axios.post(`${BASE_URL}/auth/login`, logUser)

  return response.data
}

export async function explore() {
  const response = await axios.post(`${BASE_URL}/auth/explore`)

  return response.data
}

export async function changePassword(data: ChangePassword) {
  const response = await axios.post(`${BASE_URL}/auth/reset-password`, data)

  return response.data
}

export async function logout(token: string) {
  const response = await axios.post(
    `${BASE_URL}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export async function getUser(token:string) {
  const response = await axios.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}