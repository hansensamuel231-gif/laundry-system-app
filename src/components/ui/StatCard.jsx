import { Card } from "./Card.jsx"
import { cn } from "../../lib/utils.js"

const tones = {
  blue: "bg-secondary text-secondary-foreground",
  green: "bg-success-muted text-success-muted-foreground",
  yellow: "bg-warning-muted text-warning-muted-foreground",
  red: "bg-danger-muted text-danger-muted-foreground",
}

export function StatCard({ label, value, icon: Icon, tone = "blue", hint }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}
