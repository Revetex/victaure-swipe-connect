import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  items: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  allowCustomValue?: boolean;
}

export function Combobox({
  items = [],
  value = "",
  onChange,
  placeholder = "Sélectionner une option",
  disabled = false,
  allowCustomValue = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const displayItems = React.useMemo(() => {
    if (!allowCustomValue || !searchQuery) return items;

    const existingItem = items.find(
      item => item.value.toLowerCase() === searchQuery.toLowerCase()
    );

    if (!existingItem) {
      return [...items, { value: searchQuery, label: searchQuery }];
    }

    return items;
  }, [items, searchQuery, allowCustomValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">
            {value
              ? items.find((item) => item.value === value)?.label || value
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder={`Rechercher...`} 
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {displayItems.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}