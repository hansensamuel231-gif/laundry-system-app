import { createContext, useContext, useState } from "react"
import { initialUsers } from "../lib/data.js"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("zahra_laundry_user")
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        const current = initialUsers.find((u) => u.username === parsed.username)
        if (current && current.status !== "Nonaktif") {
          return { id: current.id, username: current.username, name: current.name, role: current.role }
        }
      }
      return null
    } catch (e) {
      console.error("Failed to load user session from localStorage:", e)
      return null
    }
  })

  function login(username, password) {
    const found = initialUsers.find(
      (u) => u.username === username && u.password === password,
    )
    if (!found) return { ok: false, message: "Username atau password salah." }
    if (found.status === "Nonaktif") return { ok: false, message: "Akun Anda dinonaktifkan." }
    
    const loggedInUser = { id: found.id, username: found.username, name: found.name, role: found.role }
    setUser(loggedInUser)
    try {
      localStorage.setItem("zahra_laundry_user", JSON.stringify(loggedInUser))
    } catch (e) {
      console.error("Failed to save user session to localStorage:", e)
    }
    return { ok: true }
  }

  function logout() {
    setUser(null)
    try {
      localStorage.removeItem("zahra_laundry_user")
    } catch (e) {
      console.error("Failed to remove user session from localStorage:", e)
    }
  }

  const isAdmin = user?.role === "Admin"

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
