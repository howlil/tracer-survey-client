import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import * as React from "react"

interface SoalTeksProps {
  label: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
  inputClassName?: string
  labelClassName?: string
  type?: "text" | "email" | "number" | "tel" | "url"
  variant?: "text" | "email" | "number"
}

function SoalTeks({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className,
  inputClassName,
  labelClassName,
  type = "text",
  variant,
  ...props
}: SoalTeksProps) {
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }, [onChange])

  // Tentukan tipe input berdasarkan variant atau type
  const inputType = React.useMemo(() => {
    if (variant) {
      switch (variant) {
        case "email":
          return "email"
        case "number":
          return "number"
        case "text":
        default:
          return "text"
      }
    }
    return type
  }, [variant, type])

  // Destructure props untuk menghindari passing ke DOM
  // Filter out non-DOM props yang tidak seharusnya diteruskan ke input element
  const {
    inputType: _inputType,
    variant: _variant,
    parentId: _parentId,
    groupQuestionId: _groupQuestionId,
    pageNumber: _pageNumber,
    questionTree: _questionTree,
    questionCode: _questionCode,
    codeId: _codeId,
    ...inputProps
  } = props as Record<string, unknown>

  // Tentukan placeholder berdasarkan variant jika tidak ada placeholder
  const inputPlaceholder = React.useMemo(() => {
    if (placeholder) return placeholder
    
    if (variant) {
      switch (variant) {
        case "email":
          return "Masukkan alamat email"
        case "number":
          return "Masukkan angka"
        case "text":
        default:
          return "Masukkan teks"
      }
    }
    return placeholder
  }, [placeholder, variant])

  // Generate ID untuk input dan label
  const inputId = React.useMemo(() => 
    `soal-${label.toLowerCase().replace(/\s+/g, '-')}`, 
    [label]
  )

  return (
    <div className={cn("space-y-1", className)}>
      <Label 
        htmlFor={inputId}
        className={cn(
          "text-base font-medium text-foreground",
          required && "after:content-['*'] after:text-destructive",
          labelClassName
        )}
      >
        {label}
      </Label>
      <Input
        id={inputId}
        type={inputType}
        variant="default"
        placeholder={inputPlaceholder}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={cn(
          "text-base py-1",
          inputClassName
        )}
        {...inputProps}
      />
    </div>
  )
}

export { SoalTeks }
export type { SoalTeksProps }

