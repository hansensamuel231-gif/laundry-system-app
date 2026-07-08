import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shirt, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input, Label } from "../components/ui/Field.jsx"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    setError("")
    const res = login(username.trim(), password)
    if (res.ok) {
      navigate("/dashboard", { replace: true })
    } else {
      setError(res.message)
    }
  }

  function quickFill(u, p) {
    setUsername(u)
    setPassword(p)
    setError("")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Shirt className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">Zahra Laundry</h1>
          <p className="mt-1 text-sm text-sidebar-foreground">Sistem Manajemen Laundry</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
          <h2 className="mb-1 text-xl font-semibold">Masuk ke Akun</h2>
          <p className="mb-6 text-sm text-muted-foreground">Silakan masuk untuk melanjutkan.</p>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger-muted px-3 py-2.5 text-sm text-danger-muted-foreground">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  className="pl-9"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="pl-9 pr-9"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full">
              Masuk
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="mb-2 font-medium text-foreground">Akun demo (klik untuk mengisi):</p>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => quickFill("admin", "admin123")}
                className="flex items-center justify-between rounded-md bg-card px-2.5 py-1.5 text-left hover:bg-secondary"
              >
                <span className="font-medium text-foreground">Admin</span>
                <span className="font-mono">admin / admin123</span>
              </button>
              <button
                onClick={() => quickFill("kasir", "kasir123")}
                className="flex items-center justify-between rounded-md bg-card px-2.5 py-1.5 text-left hover:bg-secondary"
              >
                <span className="font-medium text-foreground">Kasir</span>
                <span className="font-mono">kasir / kasir123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
