import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  experienceLevels, 
  remoteTypes, 
  contractTypes, 
  postedWithinOptions,
  type JobFilters as JobFiltersType 
} from "./JobFilterUtils";
import { LocationFilter } from "./filters/LocationFilter";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (key: keyof JobFiltersType, value: any) => void;
}

export function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Type de contrat</Label>
        <Select
          value={filters.contractType}
          onValueChange={(value) => onFilterChange("contractType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <ScrollArea className="h-[200px]">
              {contractTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <LocationFilter 
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <div>
        <Label>Type de travail</Label>
        <Select
          value={filters.remoteType}
          onValueChange={(value) => onFilterChange("remoteType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {remoteTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Niveau d'expérience</Label>
        <Select
          value={filters.experienceLevel}
          onValueChange={(value) => onFilterChange("experienceLevel", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            {experienceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Salaire</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="number"
              placeholder="Min"
              value={filters.salaryMin || ""}
              onChange={(e) => onFilterChange("salaryMin", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Max"
              value={filters.salaryMax || ""}
              onChange={(e) => onFilterChange("salaryMax", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Date de publication</Label>
        <Select
          value={filters.postedWithin}
          onValueChange={(value) => onFilterChange("postedWithin", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {postedWithinOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="w-full"
        variant="outline"
        onClick={() => {
          Object.keys(filters).forEach((key) => {
            onFilterChange(key as keyof JobFiltersType, "all");
          });
        }}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
