
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  onReset: () => void;
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
  onRemoteOnlyChange,
  onReset
}: JobsFiltersProps) {
  return (
    <div className="grid gap-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filtres</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Localisation</Label>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger>
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
          <Label>Type d'entreprise</Label>
          <Select value={selectedCompanyType} onValueChange={onCompanyTypeChange}>
            <SelectTrigger>
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
          <Label>Trier par</Label>
          <Select value={sortOrder} onValueChange={onSortOrderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récent</SelectItem>
              <SelectItem value="salary">Meilleur salaire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Expérience</Label>
          <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
            <SelectTrigger>
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
          <Label>Type de contrat</Label>
          <Select value={contractType} onValueChange={onContractTypeChange}>
            <SelectTrigger>
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
      </div>
    </div>
  );
}
