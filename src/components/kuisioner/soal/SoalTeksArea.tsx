import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import * as React from "react"

interface SoalTeksAreaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  labelClassName?: string
  rows?: number
  maxLength?: number
  minLength?: number
  errorMessage?: string
}

function SoalTeksArea({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder,
  className,
  labelClassName,
  rows = 4,
  maxLength,
  minLength,
  errorMessage,
}: SoalTeksAreaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      <Label 
        htmlFor={id}
        className={cn(
          "text-sm font-medium text-foreground",
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          disabled && "text-muted-foreground",
          labelClassName
        )}
      >
        {label}
      </Label>

      {/* Textarea */}
      <Textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        minLength={minLength}
        className={cn(
          "resize-none",
          errorMessage && "border-destructive focus-visible:ring-destructive/20"
        )}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
        aria-invalid={!!errorMessage}
      />

      {/* Character Count (if maxLength is provided) */}
      {maxLength && (
        <div className="text-xs text-muted-foreground text-right">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div 
          id={`${id}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export { SoalTeksArea }
export type { SoalTeksAreaProps }
