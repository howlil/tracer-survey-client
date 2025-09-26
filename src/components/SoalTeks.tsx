import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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
  ...props
}: SoalTeksProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Label 
        htmlFor={`soal-${label.toLowerCase().replace(/\s+/g, '-')}`}
        className={cn(
          "text-base font-medium text-gray-700",
          required && "after:content-['*'] after:text-red-500",
          labelClassName
        )}
      >
        {label}
      </Label>
      <Input
        id={`soal-${label.toLowerCase().replace(/\s+/g, '-')}`}
        type={type}
        variant="default"
        placeholder={placeholder}
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
