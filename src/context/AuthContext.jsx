import { createContext, useContext, useState } from "react"
import { initialUsers } from "../lib/data.js"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login(username, password) {
    const found = initialUsers.find(
      (u) => u.username === username && u.password === password,
    )
    if (!found) return { ok: false, message: "Username atau password salah." }
    if (found.status === "Nonaktif") return { ok: false, message: "Akun Anda dinonaktifkan." }
    setUser({ id: found.id, username: found.username, name: found.name, role: found.role })
    return { ok: true }
  }

  function logout() {
    setUser(null)
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
