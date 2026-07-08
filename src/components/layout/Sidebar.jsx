import { NavLink } from "react-router-dom"
import { Shirt, LogOut, X } from "lucide-react"
import { navItems } from "../../lib/nav.js"
import { useAuth } from "../../context/AuthContext.jsx"
import { cn } from "../../lib/utils.js"

export function Sidebar({ open, onClose }) {
  const { user, isAdmin, logout } = useAuth()
  const items = navItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shirt className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-primary-foreground">LaundryPro</span>
          </div>
          <button
            onClick={onClose}
            className="text-sidebar-foreground hover:text-primary-foreground lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-active text-sidebar-active-foreground"
                          : "text-sidebar-foreground hover:bg-white/5 hover:text-primary-foreground",
                      )
                    }
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-primary-foreground">{user?.name}</p>
              <p className="truncate text-xs text-sidebar-foreground">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-danger/20 hover:text-primary-foreground"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
