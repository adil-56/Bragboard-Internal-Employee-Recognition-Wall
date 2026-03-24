import { cn } from "../../utils/cn"

export const Card = ({ className, children, ...props }) => {
  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-5 border-b border-neutral-100 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  )
}

export const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  )
}
