const BASE_URL = import.meta.env.VITE_BASE_URL
import axios from "axios"
import type { ChangePassword, LogUser, NewUser } from "../types/auth"

export async function register(newUser: NewUser) {
  const response = await axios.post(`${BASE_URL}/auth/register`, newUser)

  return response.data
}

export async function login(logUser:LogUser) {
  const response = await axios.post(`${BASE_URL}/auth/login`, logUser)

  return response.data
}

export async function explore() {
  const response = await axios.post(`${BASE_URL}/auth/explore`)

  return response.data
}

export async function changePassword(data:ChangePassword) {
  const response = await axios.post(`${BASE_URL}/auth/reset-password`, data)

  return response.data
}