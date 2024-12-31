import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "../JobFilterUtils";

interface WorkTypeFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

const contractTypes = {
  company: [
    { value: "full-time", label: "Temps plein" },
    { value: "part-time", label: "Temps partiel" },
    { value: "contract", label: "Contrat" },
    { value: "internship", label: "Stage" }
  ],
  individual: [
    { value: "one-time", label: "Unique" },
    { value: "fixed-duration", label: "Durée fixe" },
    { value: "project-based", label: "Projet" }
  ]
};

const experienceLevels = [
  { value: "entry", label: "Débutant" },
  { value: "junior", label: "Junior (1-3 ans)" },
  { value: "mid-level", label: "Intermédiaire (3-5 ans)" },
  { value: "senior", label: "Senior (5-8 ans)" },
  { value: "expert", label: "Expert (8+ ans)" },
  { value: "lead", label: "Lead" },
  { value: "director", label: "Directeur" }
];

const paymentSchedules = [
  { value: "weekly", label: "Hebdomadaire" },
  { value: "biweekly", label: "Bimensuel" },
  { value: "monthly", label: "Mensuel" },
  { value: "quarterly", label: "Trimestriel" },
  { value: "completion", label: "À la livraison" }
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
            {(filters.missionType === "individual" ? contractTypes.individual : contractTypes.company).map((type) => (
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