
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "../JobFilterUtils";

const contractTypes = [
  { value: "full_time", label: "Temps plein" },
  { value: "part_time", label: "Temps partiel" },
  { value: "contract", label: "Contrat" },
  { value: "temporary", label: "Temporaire" },
  { value: "internship", label: "Stage" }
];

const experienceLevels = [
  { value: "entry", label: "Débutant" },
  { value: "junior", label: "Junior" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "senior", label: "Senior" },
  { value: "expert", label: "Expert" }
];

interface ExperienceFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function ExperienceFilter({ filters, onFilterChange }: ExperienceFilterProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Type de contrat
        </label>
        <Select
          value={filters.duration || "no_filter"}
          onValueChange={(value) => onFilterChange("duration", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no_filter">Tous les types</SelectItem>
            {contractTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Niveau d'expérience
        </label>
        <Select
          value={filters.experienceLevel || "no_filter"}
          onValueChange={(value) => onFilterChange("experienceLevel", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les niveaux" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no_filter">Tous les niveaux</SelectItem>
            {experienceLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
