import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface OpsiJawaban {
  value: string
  label: string
  disabled?: boolean
}

interface SoalSingleChoiceProps {
  label: string
  opsiJawaban: OpsiJawaban[]
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
  radioGroupClassName?: string
  labelClassName?: string
  opsiClassName?: string
  layout?: "vertical" | "horizontal"
}

function SoalSingleChoice({
  label,
  opsiJawaban,
  value,
  onChange,
  required = false,
  disabled = false,
  className,
  radioGroupClassName,
  labelClassName,
  opsiClassName,
  layout = "vertical",
  ...props
}: SoalSingleChoiceProps) {
  const handleValueChange = (newValue: string) => {
    onChange?.(newValue)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        className={cn(
          "text-base font-medium text-gray-700",
          required && "after:content-['*'] after:text-red-500",
          labelClassName
        )}
      >
        {label}
      </Label>
      
      <RadioGroup
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        className={cn(
          layout === "horizontal" && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
          layout === "vertical" && "gap-2",
          radioGroupClassName
        )}
        {...props}
      >
        {opsiJawaban.map((opsi, index) => {
          const isSelected = value === opsi.value
          const inputId = `${label.toLowerCase().replace(/\s+/g, '-')}-${index}`
          
          return (
            <div
              key={opsi.value}
              className={cn(
                "flex items-center space-x-3 px-3 py-1 h-9 rounded-lg border transition-all duration-200 cursor-pointer",
                "hover:bg-blue-50/30 hover:border-blue-200/50",
                isSelected && "bg-blue-50/50 border-blue-200 shadow-sm",
                opsi.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:border-gray-200",
                disabled && "cursor-not-allowed hover:bg-transparent hover:border-gray-200",
                opsiClassName
              )}
              onClick={() => {
                if (!opsi.disabled && !disabled) {
                  handleValueChange(opsi.value)
                }
              }}
            >
              <RadioGroupItem
                value={opsi.value}
                id={inputId}
                disabled={opsi.disabled || disabled}
                className="focus-visible:ring-blue-500/50 focus-visible:ring-[1px]"
              />
              <Label
                htmlFor={inputId}
                className={cn(
                  "text-sm font-normal cursor-pointer flex-1",
                  isSelected && "text-blue-600 font-medium",
                  opsi.disabled && "cursor-not-allowed",
                  disabled && "cursor-not-allowed"
                )}
              >
                {opsi.label}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export { SoalSingleChoice }
export type { SoalSingleChoiceProps, OpsiJawaban }
