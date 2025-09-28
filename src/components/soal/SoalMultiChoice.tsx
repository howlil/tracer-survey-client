import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import * as React from "react"

interface OpsiJawaban {
  value: string
  label: string
  disabled?: boolean
  isOther?: boolean
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
  otherValue?: string
  onOtherValueChange?: (value: string) => void
  otherInputPlaceholder?: string
  validateOther?: boolean
  errorMessage?: string
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
  otherValue = "",
  onOtherValueChange,
  otherInputPlaceholder = "Masukkan jawaban lainnya...",
  validateOther = false,
  errorMessage = "Harap isi jawaban lainnya",
  ...props
}: SoalMultiChoiceProps) {
  const handleValueChange = React.useCallback((opsiValue: string, checked: boolean) => {
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
  }, [onChange, value])

  const handleOtherValueChange = React.useCallback((inputValue: string) => {
    onOtherValueChange?.(inputValue)
    // Jika ada input value, pastikan opsi "other" terpilih
    if (inputValue.trim()) {
      const otherOption = opsiJawaban.find(opsi => opsi.isOther)
      if (otherOption && !value.includes(otherOption.value)) {
        onChange?.([...value, otherOption.value])
      }
    }
  }, [onOtherValueChange, opsiJawaban, value, onChange])

  // Validasi: jika opsi "other" dipilih, pastikan ada teks yang diisi
  const otherOption = React.useMemo(() => 
    opsiJawaban.find(opsi => opsi.isOther), 
    [opsiJawaban]
  )
  
  const isOtherSelected = React.useMemo(() => 
    otherOption ? value.includes(otherOption.value) : false, 
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
    <div className={cn("space-y-3", className)}>
      <Label 
        className={cn(
          "text-base font-medium text-foreground",
          required && "after:content-['*'] after:text-destructive after:ml-1",
          labelClassName
        )}
      >
        {label}
      </Label>
      
      <div
        className={cn(
          layout === "horizontal" && "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
          layout === "vertical" && "space-y-2",
          "transition-all duration-200"
        )}
        {...props}
      >
        {opsiJawaban.map((opsi, index) => {
          const isSelected = value.includes(opsi.value)
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
                    handleValueChange(opsi.value, !isSelected)
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={inputId}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleValueChange(opsi.value, checked as boolean)}
                    disabled={opsi.disabled || disabled}
                    className="focus-visible:ring-primary/50 focus-visible:ring-[2px]"
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
      </div>
    </div>
  )
}

export { SoalMultiChoice }
export type { OpsiJawaban, SoalMultiChoiceProps }

