import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { quebecCities } from "@/data/cities";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobBasicInfoFieldsProps {
  title: string;
  description: string;
  budget: string;
  location: string;
  onChange: (field: string, value: string | number) => void;
}

export function JobBasicInfoFields({
  title,
  description,
  budget,
  location,
  onChange,
}: JobBasicInfoFieldsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre de la mission</Label>
        <Input
          id="title"
          placeholder="Ex: Développeur React Senior"
          value={title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description détaillée</Label>
        <Textarea
          id="description"
          placeholder="Décrivez les responsabilités et les attentes..."
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget (CAD)</Label>
        <Input
          id="budget"
          type="number"
          placeholder="Ex: 5000"
          value={budget}
          onChange={(e) => onChange("budget", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Localisation</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {location
                ? quebecCities.find((city) => city.toLowerCase() === location.toLowerCase())
                : "Sélectionnez une ville..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Rechercher une ville..." />
              <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {quebecCities.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    onSelect={(currentValue) => {
                      onChange("location", currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        location.toLowerCase() === city.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}