import { Search, SlidersHorizontal, Check, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { JobFilters } from "./JobFilterUtils";
import { missionCategories } from "@/types/job";
import { quebecCities } from "@/data/cities";
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
import { cn } from "@/lib/utils";
import { useState } from "react";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function JobFiltersPanel({ filters, onFilterChange, openLocation, setOpenLocation }: JobFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const subcategories = filters.category !== "all" ? missionCategories[filters.category]?.subcategories : [];

  return (
    <div className="bg-card p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-victaure-blue" />
          <h3 className="font-semibold">Filtres</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une offre..."
                className="pl-8"
                value={filters.searchTerm}
                onChange={(e) => onFilterChange("searchTerm", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catégorie
            </label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {Object.keys(missionCategories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filters.category !== "all" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sous-catégorie
              </label>
              <Select
                value={filters.subcategory}
                onValueChange={(value) => onFilterChange("subcategory", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les sous-catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sous-catégories</SelectItem>
                  {subcategories?.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Durée
            </label>
            <Select
              value={filters.duration}
              onValueChange={(value) => onFilterChange("duration", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les durées" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les durées</SelectItem>
                <SelectItem value="3-6">3-6 mois</SelectItem>
                <SelectItem value="6-12">6-12 mois</SelectItem>
                <SelectItem value="12+">12+ mois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Niveau d'expérience
            </label>
            <Select
              value={filters.experienceLevel}
              onValueChange={(value) => onFilterChange("experienceLevel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Mid-Level">Intermédiaire</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
        </div>
      )}
    </div>
  );
}