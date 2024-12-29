import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "../JobFilterUtils";

interface ExperienceFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function ExperienceFilter({ filters, onFilterChange }: ExperienceFilterProps) {
  return (
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
  );
}