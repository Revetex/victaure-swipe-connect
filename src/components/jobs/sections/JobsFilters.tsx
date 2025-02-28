
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface JobsFiltersProps {
  selectedLocation: string;
  selectedCompanyType: string;
  sortOrder: "recent" | "salary";
  experienceLevel: string;
  contractType: string;
  locations: string[];
  salaryRange: [number, number];
  remoteOnly: boolean;
  onLocationChange: (value: string) => void;
  onCompanyTypeChange: (value: string) => void;
  onSortOrderChange: (value: "recent" | "salary") => void;
  onExperienceLevelChange: (value: string) => void;
  onContractTypeChange: (value: string) => void;
  onSalaryRangeChange: (value: [number, number]) => void;
  onRemoteOnlyChange: (value: boolean) => void;
}

export function JobsFilters({
  selectedLocation,
  selectedCompanyType,
  sortOrder,
  experienceLevel,
  contractType,
  locations,
  salaryRange,
  remoteOnly,
  onLocationChange,
  onCompanyTypeChange,
  onSortOrderChange,
  onExperienceLevelChange,
  onContractTypeChange,
  onSalaryRangeChange,
  onRemoteOnlyChange
}: JobsFiltersProps) {
  const resetFilters = () => {
    onLocationChange("");
    onCompanyTypeChange("");
    onSortOrderChange("recent");
    onExperienceLevelChange("");
    onContractTypeChange("");
    onSalaryRangeChange([0, 200000]);
    onRemoteOnlyChange(false);
  };

  return (
    <div className="py-2 space-y-5">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-normal text-muted-foreground">Localisation</Label>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="h-9 bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5">
              <SelectValue placeholder="Toutes les localisations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les localisations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-normal text-muted-foreground">Type d'entreprise</Label>
          <Select value={selectedCompanyType} onValueChange={onCompanyTypeChange}>
            <SelectTrigger className="h-9 bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="internal">Interne</SelectItem>
              <SelectItem value="external">Externe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-normal text-muted-foreground">Niveau d'expérience</Label>
          <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
            <SelectTrigger className="h-9 bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5">
              <SelectValue placeholder="Niveau d'expérience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les niveaux</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-normal text-muted-foreground">Type de contrat</Label>
          <Select value={contractType} onValueChange={onContractTypeChange}>
            <SelectTrigger className="h-9 bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5">
              <SelectValue placeholder="Type de contrat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types</SelectItem>
              <SelectItem value="permanent">CDI</SelectItem>
              <SelectItem value="temporary">CDD</SelectItem>
              <SelectItem value="contract">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-normal text-muted-foreground">Salaire annuel</Label>
          <Slider
            defaultValue={salaryRange}
            max={200000}
            step={5000}
            value={salaryRange}
            onValueChange={(value) => onSalaryRangeChange(value as [number, number])}
            className="my-5"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{salaryRange[0].toLocaleString()} CAD</span>
            <span>{salaryRange[1].toLocaleString()} CAD</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <Checkbox
            id="remoteOnly"
            checked={remoteOnly}
            onCheckedChange={(checked) => onRemoteOnlyChange(!!checked)}
          />
          <Label 
            htmlFor="remoteOnly" 
            className="text-sm font-normal cursor-pointer"
          >
            Télétravail uniquement
          </Label>
        </div>

        <div className="flex justify-between pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs h-8 px-3 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5 mr-1.5" />
            Réinitialiser les filtres
          </Button>
          <Button
            size="sm"
            className="text-xs h-8 px-4 bg-primary/90 hover:bg-primary dark:bg-[#9b87f5]/90 dark:hover:bg-[#9b87f5]"
          >
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
}
