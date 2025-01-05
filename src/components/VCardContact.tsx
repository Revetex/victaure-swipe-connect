import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { provinces, provinceData, type Province } from "@/data/provinces";
import { toast } from "sonner";

interface VCardContactProps {
  profile: any;
  isEditing?: boolean;
  onUpdate?: (field: string, value: any) => void;
}

export function VCardContact({ profile, isEditing, onUpdate }: VCardContactProps) {
  const [openProvince, setOpenProvince] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  useEffect(() => {
    if (profile.state) {
      setSelectedProvince(profile.state as Province);
    }
  }, [profile.state]);

  const filteredProvinces = provinces.filter(province =>
    province.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  const availableCities = selectedProvince ? provinceData[selectedProvince] : [];
  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    onUpdate?.('state', province);
    setOpenProvince(false);
    setProvinceSearch("");
    // Reset city when province changes
    onUpdate?.('city', '');
    toast.success("Province mise à jour");
  };

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
          <Label>Province</Label>
          <Popover open={openProvince && isEditing} onOpenChange={setOpenProvince}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openProvince}
                className="w-full justify-between"
                disabled={!isEditing}
              >
                {profile.state || "Sélectionnez une province"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Rechercher une province..."
                  value={provinceSearch}
                  onValueChange={setProvinceSearch}
                />
                <CommandList>
                  <CommandEmpty>Aucune province trouvée.</CommandEmpty>
                  {filteredProvinces.map((province) => (
                    <CommandItem
                      key={province}
                      value={province}
                      onSelect={() => handleProvinceSelect(province as Province)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          profile.state === province ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {province}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Ville</Label>
          <Popover open={openCity && isEditing} onOpenChange={setOpenCity}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCity}
                className="w-full justify-between"
                disabled={!isEditing || !selectedProvince}
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
                  <CommandEmpty>
                    {!selectedProvince 
                      ? "Veuillez d'abord sélectionner une province" 
                      : "Aucune ville trouvée."}
                  </CommandEmpty>
                  {filteredCities.map((city) => (
                    <CommandItem
                      key={city}
                      value={city}
                      onSelect={() => {
                        onUpdate?.('city', city);
                        setOpenCity(false);
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