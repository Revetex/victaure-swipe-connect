import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { provinceData } from "@/data/provinces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { JobFilters as JobFiltersType } from "@/types/filters";
import { missionCategories } from "@/types/job";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (key: keyof JobFiltersType, value: any) => void;
}

export function JobFilters({
  filters,
  onFilterChange,
}: JobFiltersProps) {
  const isMobile = useIsMobile();
  const subcategories = filters.category !== "all" ? missionCategories[filters.category]?.subcategories : [];

  return (
    <div className={`lg:col-span-1 bg-card rounded-lg shadow-sm border ${
      isMobile ? "sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm" : ""
    }`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Filtres</h3>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Recherche</h4>
          <Input
            placeholder="Rechercher une offre..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange("searchTerm", e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Catégorie</h4>
          <Select value={filters.category} onValueChange={(value) => onFilterChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {Object.keys(missionCategories).map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory - Only show if category is selected */}
        {filters.category !== "all" && subcategories && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Sous-catégorie</h4>
            <Select value={filters.subcategory} onValueChange={(value) => onFilterChange("subcategory", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les sous-catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sous-catégories</SelectItem>
                {subcategories.map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Contract Type */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Type de contrat</h4>
          <Select value={filters.duration} onValueChange={(value) => onFilterChange("duration", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {["Full-time", "Part-time", "Contract", "Temporary", "Freelance"].map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Niveau d'expérience</h4>
          <Select value={filters.experienceLevel} onValueChange={(value) => onFilterChange("experienceLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les niveaux" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              {["Junior", "Mid-Level", "Senior", "Expert"].map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Remote Type */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Type de travail</h4>
          <Select value={filters.remoteType} onValueChange={(value) => onFilterChange("remoteType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="on-site">Sur site</SelectItem>
              <SelectItem value="remote">Télétravail</SelectItem>
              <SelectItem value="hybrid">Hybride</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Budget (CAD/jour)</h4>
          <Slider
            defaultValue={[filters.minBudget, filters.maxBudget]}
            max={1000}
            min={300}
            step={50}
            onValueChange={(value) => {
              onFilterChange("minBudget", value[0]);
              onFilterChange("maxBudget", value[1]);
            }}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.minBudget} CAD</span>
            <span>{filters.maxBudget} CAD</span>
          </div>
        </div>

        {/* Date Filters */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Dates</h4>
          
          {/* Created After */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Créé après</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.createdAfter ? 
                    format(new Date(filters.createdAfter), 'PP', { locale: fr }) : 
                    'Sélectionner une date'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filters.createdAfter ? new Date(filters.createdAfter) : undefined}
                  onSelect={(date) => onFilterChange("createdAfter", date?.toISOString() || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Created Before */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Créé avant</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.createdBefore ? 
                    format(new Date(filters.createdBefore), 'PP', { locale: fr }) : 
                    'Sélectionner une date'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filters.createdBefore ? new Date(filters.createdBefore) : undefined}
                  onSelect={(date) => onFilterChange("createdBefore", date?.toISOString() || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Application Deadline */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Date limite de candidature</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.deadlineBefore ? 
                    format(new Date(filters.deadlineBefore), 'PP', { locale: fr }) : 
                    'Sélectionner une date'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={filters.deadlineBefore ? new Date(filters.deadlineBefore) : undefined}
                  onSelect={(date) => onFilterChange("deadlineBefore", date?.toISOString() || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Reset Filters */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            Object.keys(filters).forEach((key) => {
              onFilterChange(key as keyof JobFiltersType, 
                key === "minBudget" ? 300 : 
                key === "maxBudget" ? 1000 : 
                key === "skills" ? [] : 
                "all"
              );
            });
          }}
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  );
}