import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import * as React from "react"

interface RatingItem {
  id: string
  label: string
  disabled?: boolean
}

interface RatingOption {
  value: string
  label: string
}

interface SoalRatingProps {
  label: string
  ratingItems: RatingItem[]
  ratingOptions?: RatingOption[]
  values?: Record<string, string>
  onChange?: (itemId: string, value: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  tableClassName?: string
  headerClassName?: string
  cellClassName?: string
}

const DEFAULT_RATING_OPTIONS = [
  { value: "sangat-buruk", label: "Sangat Buruk" },
  { value: "buruk", label: "Buruk" },
  { value: "cukup", label: "Cukup" },
  { value: "baik", label: "Baik" },
  { value: "sangat-baik", label: "Sangat Baik" }
]

function SoalRating({
  label,
  ratingItems,
  ratingOptions = DEFAULT_RATING_OPTIONS,
  values = {},
  onChange,
  required = false,
  disabled = false,
  className,
  labelClassName,
  tableClassName,
  headerClassName,
  cellClassName,
}: SoalRatingProps) {
  const handleValueChange = React.useCallback((itemId: string, value: string) => {
    onChange?.(itemId, value)
  }, [onChange])

  return (
    <div className={cn("space-y-4", className)}>
      <Label 
        className={cn(
          "text-base font-medium text-foreground",
          required && "after:content-['*'] after:text-destructive",
          labelClassName
        )}
      >
        {label}
      </Label>
      
      <div className="overflow-x-auto">
        <table className={cn("w-full border-collapse rounded-lg overflow-hidden", tableClassName)}>
          <thead>
            <tr className="border-b border-gray-200">
              <th className={cn(
                "text-left py-3 px-4 font-normal text-foreground bg-muted rounded-tl-lg",
                "min-w-[200px] w-1/3",
                headerClassName
              )}>
                Uraian
              </th>
              {ratingOptions.map((option, index) => (
                <th 
                  key={option.value}
                  className={cn(
                    "text-center py-3 px-2 font-normal text-foreground bg-muted",
                    "min-w-[80px]",
                    index === ratingOptions.length - 1 && "rounded-tr-lg",
                    headerClassName
                  )}
                >
                  {option.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ratingItems.map((item, index) => {
              const itemValue = values[item.id] || ""
              const isDisabled = item.disabled || disabled
              const isLastRow = index === ratingItems.length - 1
              
              return (
                <tr 
                  key={item.id}
                  className={cn(
                    "border-b border-border hover:bg-muted/50",
                    index % 2 === 0 ? "bg-background" : "bg-muted/30"
                  )}
                >
                  <td className={cn(
                    "py-3 px-4 text-sm text-foreground",
                    isLastRow && "rounded-bl-lg",
                    cellClassName
                  )}>
                    {item.label}
                  </td>
                  {ratingOptions.map((option, optionIndex) => (
                    <td 
                      key={option.value}
                      className={cn(
                        "py-3 px-2 text-center cursor-pointer hover:bg-primary/10 transition-colors",
                        isLastRow && optionIndex === ratingOptions.length - 1 && "rounded-br-lg",
                        cellClassName
                      )}
                      onClick={() => {
                        if (!isDisabled) {
                          handleValueChange(item.id, option.value)
                        }
                      }}
                    >
                      <RadioGroup
                        value={itemValue}
                        onValueChange={(value) => handleValueChange(item.id, value)}
                        disabled={isDisabled}
                        className="flex justify-center"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${item.id}-${option.value}`}
                          disabled={isDisabled}
                          className="focus-visible:ring-primary/50 focus-visible:ring-[1px]"
                        />
                      </RadioGroup>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { SoalRating }
export type { RatingItem, RatingOption, SoalRatingProps }

