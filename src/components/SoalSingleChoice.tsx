import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface OpsiJawaban {
  value: string
  label: string
  disabled?: boolean
  isOther?: boolean
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
  otherValue?: string
  onOtherValueChange?: (value: string) => void
  otherInputPlaceholder?: string
  validateOther?: boolean
  errorMessage?: string
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
  otherValue = "",
  onOtherValueChange,
  otherInputPlaceholder = "Masukkan jawaban lainnya...",
  validateOther = false,
  errorMessage = "Harap isi jawaban lainnya",
  ...props
}: SoalSingleChoiceProps) {
  const handleValueChange = (newValue: string) => {
    onChange?.(newValue)
  }

  const handleOtherValueChange = (inputValue: string) => {
    onOtherValueChange?.(inputValue)
    // Jika ada input value, set value ke opsi "other" yang dipilih
    if (inputValue.trim()) {
      const otherOption = opsiJawaban.find(opsi => opsi.isOther)
      if (otherOption && value !== otherOption.value) {
        onChange?.(otherOption.value)
      }
    }
  }

  // Validasi: jika opsi "other" dipilih, pastikan ada teks yang diisi
  const otherOption = opsiJawaban.find(opsi => opsi.isOther)
  const isOtherSelected = otherOption ? value === otherOption.value : false
  const hasOtherError = validateOther && isOtherSelected && !otherValue?.trim()

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        className={cn(
          "text-base font-medium text-black",
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
            <div key={opsi.value}>
              <div
                className={cn(
                  "px-3 py-1 rounded-lg border transition-all duration-200 cursor-pointer",
                  "hover:bg-blue-50/30 hover:border-blue-200/50",
                  isSelected && "bg-blue-50/50 border-blue-200 shadow-sm",
                  opsi.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:border-gray-200",
                  disabled && "cursor-not-allowed hover:bg-transparent hover:border-gray-200",
                  opsiClassName,
                  // Jika opsi "other" dan dipilih, ubah height untuk accommodate input
                  opsi.isOther && isSelected ? "h-auto py-3" : "h-9"
                )}
                onClick={() => {
                  if (!opsi.disabled && !disabled) {
                    handleValueChange(opsi.value)
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={opsi.value}
                    id={inputId}
                    disabled={opsi.disabled || disabled}
                    className="focus-visible:ring-blue-500/50 focus-visible:ring-[1px]"
                  />
                  <Label
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
                
                {/* Tampilkan input field di dalam opsi jika ini adalah "other" dan dipilih */}
                {opsi.isOther && isSelected && (
                  <div className="mt-2 ml-6 space-y-1">
                    <Input
                      value={otherValue}
                      onChange={(e) => handleOtherValueChange(e.target.value)}
                      placeholder={otherInputPlaceholder}
                      disabled={disabled}
                      variant="underline"
                      className={cn(
                        "w-full border-0 border-b-2 rounded-none px-0 py-1 text-sm",
                        hasOtherError 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-gray-300 focus:border-blue-500"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {hasOtherError && (
                      <p className="text-xs text-red-500">{errorMessage}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export { SoalSingleChoice }
export type { OpsiJawaban, SoalSingleChoiceProps }

