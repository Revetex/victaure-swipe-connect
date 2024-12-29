import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { quebecCities } from "@/data/cities";
import { JobFilters } from "../JobFilterUtils";

interface LocationFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function LocationFilter({ filters, onFilterChange, openLocation, setOpenLocation }: LocationFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Localisation
      </label>
      <Popover open={openLocation} onOpenChange={setOpenLocation}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openLocation}
            className="w-full justify-between"
          >
            {filters.location
              ? filters.location
              : "Sélectionner une ville..."}
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
                    onFilterChange("location", currentValue);
                    setOpenLocation(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      filters.location === city ? "opacity-100" : "opacity-0"
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
  );
}