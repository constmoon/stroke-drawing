import { cn } from "@/utils/string.helper"

interface RangeInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  unit?: string
}

const RangeInput: React.FC<RangeInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  unit = "",
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-600 mt-1">
        {value}
        {unit}
      </span>
    </div>
  )
}

export default RangeInput
