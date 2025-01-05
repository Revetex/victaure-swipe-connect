import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { quebecCities } from "@/data/cities";
import { toast } from "sonner";

interface VCardContactProps {
  profile: any;
  isEditing?: boolean;
  onUpdate?: (field: string, value: any) => void;
}

export function VCardContact({ profile, isEditing, onUpdate }: VCardContactProps) {
  const [open, setOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const filteredCities = quebecCities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Adresse</Label>
          <Input
            placeholder="Entrez votre adresse"
            value={profile.address || ""}
            onChange={(e) => onUpdate?.('address', e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label>Ville</Label>
          <Popover open={open && isEditing} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={!isEditing}
              >
                {profile.city || "Sélectionnez une ville"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Rechercher une ville..."
                  value={citySearch}
                  onValueChange={setCitySearch}
                />
                <CommandList>
                  <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                  {filteredCities.map((city) => (
                    <CommandItem
                      key={city}
                      value={city}
                      onSelect={() => {
                        onUpdate?.('city', city);
                        setOpen(false);
                        setCitySearch("");
                        toast.success("Ville mise à jour");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          profile.city === city ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Province</Label>
          <Input
            value="Québec"
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label>Pays</Label>
          <Input
            value="Canada"
            disabled
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
}