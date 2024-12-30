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
  formData: any;
  setFormData: (data: any) => void;
}

export function JobBasicInfoFields({ formData, setFormData }: JobBasicInfoFieldsProps) {
  const [open, setOpen] = useState(false);
  const cities = quebecCities || [];

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre de la mission</Label>
          <Input
            id="title"
            placeholder="Ex: Développeur React Senior"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Décrivez la mission en détail"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Ville</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {formData.location
                  ? cities.find((city) => city === formData.location)
                  : "Sélectionnez une ville..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher une ville..." />
                <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-auto">
                  {cities.map((city) => (
                    <CommandItem
                      key={city}
                      value={city}
                      onSelect={(currentValue) => {
                        setFormData({ ...formData, location: currentValue });
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.location === city ? "opacity-100" : "opacity-0"
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

        <div className="space-y-2">
          <Label htmlFor="budget">Budget (CAD)</Label>
          <Input
            id="budget"
            type="number"
            placeholder="Ex: 5000"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}