import { cn } from "../../utils/cn"

const Button = ({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}) => {
  const baseStyles = "btn inline-flex items-center justify-center transition-all duration-150 font-medium"
  
  const variants = {
    primary: "btn-primary",
    secondary: "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 shadow-sm",
    ghost: "btn-ghost text-neutral-600 hover:text-neutral-900",
    danger: "bg-danger-600 hover:bg-danger-700 text-white shadow-sm"
  }

  const sizes = {
    sm: "text-xs px-3 py-1.5 h-8",
    md: "text-sm px-4 py-2 h-10",
    lg: "text-base px-6 py-3 h-12"
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
