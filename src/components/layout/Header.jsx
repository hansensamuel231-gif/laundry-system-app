import { useEffect, useState } from "react"
import { Menu, CalendarClock } from "lucide-react"
import { useAuth } from "../../context/AuthContext.jsx"
import { formatDateTime } from "../../lib/utils.js"

export function Header({ onMenuClick }) {
  const { user } = useAuth()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-foreground hover:bg-muted lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <CalendarClock className="h-4 w-4" />
          <span>{formatDateTime(now)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {user?.name?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  )
}
