import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "../JobFilterUtils";
import { contractTypes, experienceLevels } from "@/data/provinces";

interface WorkTypeFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

const paymentSchedules = [
  { value: "weekly", label: "Hebdomadaire" },
  { value: "biweekly", label: "Bimensuel" },
  { value: "monthly", label: "Mensuel" },
  { value: "quarterly", label: "Trimestriel" },
  { value: "completion", label: "À la livraison" },
];

export function WorkTypeFilters({ filters, onFilterChange }: WorkTypeFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Type de contrat
        </label>
        <Select
          value={filters.duration}
          onValueChange={(value) => onFilterChange("duration", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
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
          value={filters.experienceLevel}
          onValueChange={(value) => onFilterChange("experienceLevel", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            {experienceLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.missionType === "individual" && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Fréquence de paiement
          </label>
          <Select
            value={filters.paymentSchedule}
            onValueChange={(value) => onFilterChange("paymentSchedule", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une fréquence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les fréquences</SelectItem>
              {paymentSchedules.map((schedule) => (
                <SelectItem key={schedule.value} value={schedule.value}>
                  {schedule.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}