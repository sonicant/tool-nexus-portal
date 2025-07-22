import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
  text?: string
}

export function LoadingSpinner({ className, size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 py-8", className)}>
      <div className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}