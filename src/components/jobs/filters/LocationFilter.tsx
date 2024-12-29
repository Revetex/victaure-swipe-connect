import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { quebecCities } from "@/data/cities";
import { useTranslation } from "react-i18next";

interface LocationFilterProps {
  location: string;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
  onLocationChange: (value: string) => void;
}

export function LocationFilter({
  location,
  openLocation,
  setOpenLocation,
  onLocationChange,
}: LocationFilterProps) {
  const { t } = useTranslation("jobs");

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {t("filters.location")}
      </label>
      <Popover open={openLocation} onOpenChange={setOpenLocation}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openLocation}
            className="w-full justify-between"
          >
            {location || t("filters.selectCity")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={t("filters.selectCity")} />
            <CommandEmpty>{t("filters.noCity")}</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {quebecCities.map((city) => (
                <CommandItem
                  key={city}
                  value={city}
                  onSelect={(currentValue) => {
                    onLocationChange(currentValue);
                    setOpenLocation(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      location === city ? "opacity-100" : "opacity-0"
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