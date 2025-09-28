import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import * as React from "react"

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
  const handleValueChange = React.useCallback((newValue: string) => {
    onChange?.(newValue)
  }, [onChange])

  const handleOtherValueChange = React.useCallback((inputValue: string) => {
    onOtherValueChange?.(inputValue)
    // Jika ada input value, set value ke opsi "other" yang dipilih
    if (inputValue.trim()) {
      const otherOption = opsiJawaban.find(opsi => opsi.isOther)
      if (otherOption && value !== otherOption.value) {
        onChange?.(otherOption.value)
      }
    }
  }, [onOtherValueChange, opsiJawaban, value, onChange])

  // Validasi: jika opsi "other" dipilih, pastikan ada teks yang diisi
  const otherOption = React.useMemo(() => 
    opsiJawaban.find(opsi => opsi.isOther), 
    [opsiJawaban]
  )
  
  const isOtherSelected = React.useMemo(() => 
    otherOption ? value === otherOption.value : false, 
    [otherOption, value]
  )
  
  const hasOtherError = React.useMemo(() => 
    validateOther && isOtherSelected && !otherValue?.trim(), 
    [validateOther, isOtherSelected, otherValue]
  )

  // Generate input IDs untuk semua opsi
  const inputIds = React.useMemo(() => 
    opsiJawaban.map((_, index) => 
      `${label.toLowerCase().replace(/\s+/g, '-')}-${index}`
    ), 
    [label, opsiJawaban.length]
  )

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        className={cn(
          "text-base font-medium text-foreground",
          required && "after:content-['*'] after:text-destructive",
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
          const inputId = inputIds[index]
          
          return (
            <div key={opsi.value}>
              <div
                className={cn(
                  "px-3 py-1 rounded-lg border transition-all duration-200 cursor-pointer",
                  "hover:bg-primary/10 hover:border-primary/30",
                  isSelected && "bg-primary/10 border-primary shadow-sm",
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
                    className="focus-visible:ring-primary/50 focus-visible:ring-[1px]"
                  />
                  <Label
                    className={cn(
                      "text-sm font-normal cursor-pointer flex-1",
                      isSelected && "text-primary font-medium",
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
                          ? "border-destructive focus:border-destructive" 
                          : "border-input focus:border-primary"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {hasOtherError && (
                      <p className="text-xs text-destructive">{errorMessage}</p>
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

