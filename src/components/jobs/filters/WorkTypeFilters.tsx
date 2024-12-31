import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "@/types/filters";
import { contractTypes, experienceLevels } from "@/data/provinces";

interface WorkTypeFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function WorkTypeFilters({ filters, onFilterChange }: WorkTypeFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Type de contrat</h4>
        <Select value={filters.duration} onValueChange={(value) => onFilterChange("duration", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {contractTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Niveau d'expérience</h4>
        <Select value={filters.experienceLevel} onValueChange={(value) => onFilterChange("experienceLevel", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les niveaux" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            {experienceLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
    </div>
  );
}