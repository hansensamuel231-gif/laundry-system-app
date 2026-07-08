import { cn } from "../../lib/utils.js"

const statusStyles = {
  Proses: "bg-warning-muted text-warning-muted-foreground",
  Selesai: "bg-success-muted text-success-muted-foreground",
  Pending: "bg-danger-muted text-danger-muted-foreground",
}

const roleStyles = {
  Admin: "bg-secondary text-secondary-foreground",
  Kasir: "bg-muted text-muted-foreground",
}

const activeStyles = {
  Aktif: "bg-success-muted text-success-muted-foreground",
  Nonaktif: "bg-danger-muted text-danger-muted-foreground",
}

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] || "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  )
}

export function RoleBadge({ role }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        roleStyles[role] || "bg-muted text-muted-foreground",
      )}
    >
      {role}
    </span>
  )
}

export function ActiveBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        activeStyles[status] || "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  )
}
