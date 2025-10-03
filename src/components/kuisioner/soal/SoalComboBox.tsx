import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { useState } from "react"

interface OpsiComboBox {
  value: string
  label: string
  disabled?: boolean
}

interface ComboBoxItem {
  id: string
  label: string
  placeholder?: string
  searchPlaceholder?: string
  required?: boolean
  disabled?: boolean
  opsiComboBox: OpsiComboBox[]
}

interface SoalComboBoxProps {
  label: string
  comboboxItems: ComboBoxItem[]
  values?: Record<string, string>
  onChange?: (id: string, value: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  comboboxClassName?: string
  layout?: "vertical" | "horizontal"
}

function SoalComboBox({
  label,
  comboboxItems,
  values = {},
  onChange,
  required = false,
  disabled = false,
  className,
  labelClassName,
  comboboxClassName,
  layout = "vertical",
  ...props
}: SoalComboBoxProps) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  const handleValueChange = React.useCallback((id: string, value: string) => {
    onChange?.(id, value)
  }, [onChange])

  const toggleOpen = React.useCallback((id: string) => {
    setOpenStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }, [])

  const getSelectedLabel = React.useCallback((id: string) => {
    const item = comboboxItems.find(item => item.id === id)
    const selectedValue = values[id]
    if (!selectedValue) return item?.placeholder || "Pilih..."
    
    const selectedOption = item?.opsiComboBox.find(option => option.value === selectedValue)
    return selectedOption?.label || item?.placeholder || "Pilih..."
  }, [comboboxItems, values])

  return (
    <div className={cn("space-y-3", className)}>
      <Label 
                className={cn(
                  "text-base font-medium text-foreground",
                  required && "after:content-['*'] after:text-destructive",
                  labelClassName
                )}
      >
        {label}
      </Label>
      
      <div
        className={cn(
          layout === "horizontal" && "grid grid-cols-1 md:grid-cols-2 gap-3",
          layout === "vertical" && "space-y-3",
          "transition-all duration-200"
        )}
        {...props}
      >
        {comboboxItems.map((item) => {
          const isOpen = openStates[item.id] || false
          const selectedValue = values[item.id]
          const isDisabled = item.disabled || disabled
          const inputId = `combobox-${item.id}`
          
          return (
            <div key={item.id} className="space-y-2">
              <Label 
                htmlFor={inputId}
                className={cn(
                  "text-sm font-medium text-foreground",
                  item.required && "after:content-['*'] after:text-destructive",
                  isDisabled && "text-muted-foreground"
                )}
              >
                {item.label}
              </Label>
              
              <Popover open={isOpen} onOpenChange={() => toggleOpen(item.id)}>
                <PopoverTrigger asChild>
                  <button
                    id={inputId}
                    className={cn(
                      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      "hover:bg-primary/10 hover:border-primary/30",
                      comboboxClassName
                    )}
                    disabled={isDisabled}
                  >
                    <span className={cn(
                      "truncate",
                      !selectedValue && "text-muted-foreground"
                    )}>
                      {getSelectedLabel(item.id)}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder={item.searchPlaceholder || "Cari..."} 
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Tidak ada pilihan ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {item.opsiComboBox.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={(currentValue) => {
                              handleValueChange(item.id, currentValue)
                              toggleOpen(item.id)
                            }}
                            disabled={option.disabled}
                            className="flex items-center justify-between"
                          >
                            <span>{option.label}</span>
                            {selectedValue === option.value && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { SoalComboBox }
export type { ComboBoxItem, OpsiComboBox, SoalComboBoxProps }

