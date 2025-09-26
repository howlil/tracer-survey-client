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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  // Tentukan tipe input berdasarkan variant atau type
  const getInputType = () => {
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
  }

  // Tentukan placeholder berdasarkan variant jika tidak ada placeholder
  const getPlaceholder = () => {
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
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Label 
        htmlFor={`soal-${label.toLowerCase().replace(/\s+/g, '-')}`}
        className={cn(
          "text-base font-medium text-black",
          required && "after:content-['*'] after:text-red-500",
          labelClassName
        )}
      >
        {label}
      </Label>
      <Input
        id={`soal-${label.toLowerCase().replace(/\s+/g, '-')}`}
        type={getInputType()}
        variant="default"
        placeholder={getPlaceholder()}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={cn(
          "text-base py-1",
          inputClassName
        )}
        {...props}
      />
    </div>
  )
}

export { SoalTeks }
export type { SoalTeksProps }

