import { cn } from "../../lib/utils.js"

const baseInput =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function Label({ className, ...props }) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-foreground", className)} {...props} />
}

export function Input({ className, ...props }) {
  return <input className={cn(baseInput, className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(baseInput, "cursor-pointer", className)} {...props}>
      {children}
    </select>
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(baseInput, "h-auto min-h-[80px] py-2 leading-relaxed", className)}
      {...props}
    />
  )
}

export function FormRow({ label, children, htmlFor }) {
  return (
    <div>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
    </div>
  )
}
