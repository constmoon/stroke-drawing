import { forwardRef } from "react"
import { classNames } from "@/utils/string.helper"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const baseStyles = classNames(
      "inline-flex items-center justify-center",
      "font-medium rounded-lg",
      "cursor-pointer",
      "px-4 py-2.5 text-sm",
      "bg-white",
      "border",
    )

    return (
      <button
        ref={ref}
        className={classNames(baseStyles, className)}
        {...props}
      >
        {children}
      </button>
    )
  },
)

export default Button
