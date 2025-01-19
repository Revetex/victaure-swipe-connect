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
import { useState } from "react";

const models = [
  {
    value: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    label: "Mixtral 8x7B",
    description: "Modèle par défaut - Excellent rapport performance/vitesse"
  },
  {
    value: "meta-llama/Llama-2-70b-chat-hf",
    label: "Llama 2 70B",
    description: "Plus puissant mais plus lent"
  },
  {
    value: "tiiuae/falcon-180B-chat",
    label: "Falcon 180B",
    description: "Très puissant pour des réponses détaillées"
  },
] as const;

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (currentValue: string) => {
    onValueChange(currentValue === value ? value : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? models.find((model) => model.value === value)?.label
            : "Sélectionner un modèle..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Rechercher un modèle..." />
          <CommandEmpty>Aucun modèle trouvé.</CommandEmpty>
          <CommandGroup>
            {models.map((model) => (
              <CommandItem
                key={model.value}
                value={model.value}
                onSelect={() => handleSelect(model.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === model.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{model.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}