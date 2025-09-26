import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface OpsiJawaban {
  value: string
  label: string
  disabled?: boolean
}

interface SoalMultiChoiceProps {
  label: string
  opsiJawaban: OpsiJawaban[]
  value?: string[]
  onChange?: (value: string[]) => void
  required?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  opsiClassName?: string
  layout?: "vertical" | "horizontal"
}

function SoalMultiChoice({
  label,
  opsiJawaban,
  value = [],
  onChange,
  required = false,
  disabled = false,
  className,
  labelClassName,
  opsiClassName,
  layout = "vertical",
  ...props
}: SoalMultiChoiceProps) {
  const handleValueChange = (opsiValue: string, checked: boolean) => {
    if (!onChange) return
    
    if (checked) {
      // Tambahkan opsi ke array jika belum ada
      if (!value.includes(opsiValue)) {
        onChange([...value, opsiValue])
      }
    } else {
      // Hapus opsi dari array
      onChange(value.filter(v => v !== opsiValue))
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label 
        className={cn(
          "text-base font-medium text-gray-700",
          required && "after:content-['*'] after:text-red-500 after:ml-1",
          labelClassName
        )}
      >
        {label}
      </Label>
      
      <div
        className={cn(
          layout === "horizontal" && "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
          layout === "vertical" && "space-y-3",
          "transition-all duration-200"
        )}
        {...props}
      >
        {opsiJawaban.map((opsi, index) => {
          const isSelected = value.includes(opsi.value)
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
                  handleValueChange(opsi.value, !isSelected)
                }
              }}
            >
              <Checkbox
                id={inputId}
                checked={isSelected}
                onCheckedChange={(checked) => handleValueChange(opsi.value, checked as boolean)}
                disabled={opsi.disabled || disabled}
                className="focus-visible:ring-blue-500/50 focus-visible:ring-[2px]"
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
      </div>
    </div>
  )
}

export { SoalMultiChoice }
export type { SoalMultiChoiceProps, OpsiJawaban }
