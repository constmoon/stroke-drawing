import { cn } from "@/utils/string.helper"

interface ColorInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  label: string
  value: string
  onChange: (value: string) => void
}

const ColorInput: React.FC<ColorInputProps> = ({
  label,
  value,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
        {...props}
      />
    </div>
  )
}

export default ColorInput
