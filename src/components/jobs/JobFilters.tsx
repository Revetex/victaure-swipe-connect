
import { CategoryFilters } from "./filters/CategoryFilters";
import { LocationFilter } from "./filters/LocationFilter";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters } from "./JobFilterUtils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface JobFiltersProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  onReset?: () => void;
}

const experienceLevels = [
  "Entry Level",
  "Junior (1-3 years)",
  "Intermediate (3-5 years)",
  "Senior (5+ years)",
  "Lead",
  "Expert"
];

const contractTypes = {
  company: [
    { id: "full_time", label: "Temps plein" },
    { id: "part_time", label: "Temps partiel" },
    { id: "contract", label: "Contrat" },
    { id: "temporary", label: "Temporaire" },
    { id: "internship", label: "Stage" },
    { id: "seasonal", label: "Saisonnier" }
  ],
  individual: [
    { id: "one_time", label: "Unique" },
    { id: "fixed_duration", label: "Durée déterminée" },
    { id: "project_based", label: "Basé sur projet" },
    { id: "consulting", label: "Consultation" }
  ]
};

const remoteTypes = [
  { value: "on-site", label: "Sur place" },
  { value: "hybrid", label: "Hybride" },
  { value: "remote", label: "À distance" },
  { value: "flexible", label: "Flexible" }
];

const postedWithinOptions = [
  { value: "24h", label: "24 heures" },
  { value: "3d", label: "3 jours" },
  { value: "7d", label: "7 jours" },
  { value: "14d", label: "14 jours" },
  { value: "30d", label: "30 jours" },
  { value: "all", label: "Tout" }
];

export function JobFilters({ filters, onFilterChange, onReset }: JobFiltersProps) {
  const handleSliderChange = (value: number[]) => {
    onFilterChange("salary", value);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtres</h3>
        {onReset && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </div>

      <CategoryFilters 
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <LocationFilter
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <div className="space-y-4">
        <Label>Type de contrat</Label>
        <Select
          value={filters.contractType}
          onValueChange={(value) => onFilterChange("contractType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {contractTypes.company.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Niveau d'expérience</Label>
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
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Type de travail</Label>
        <Select
          value={filters.remoteType}
          onValueChange={(value) => onFilterChange("remoteType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {remoteTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Publié dans les</Label>
        <Select
          value={filters.postedWithin}
          onValueChange={(value) => onFilterChange("postedWithin", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une période" />
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

      <div className="space-y-4">
        <Label>Salaire annuel (CAD)</Label>
        <Slider
          min={30000}
          max={200000}
          step={5000}
          value={filters.salary || [30000, 200000]}
          onValueChange={handleSliderChange}
          className="mt-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{filters.salary ? `${filters.salary[0]}$` : "30,000$"}</span>
          <span>{filters.salary ? `${filters.salary[1]}$` : "200,000$"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label>Travail à distance uniquement</Label>
        <Switch
          checked={filters.remote}
          onCheckedChange={(checked) => onFilterChange("remote", checked)}
        />
      </div>
    </Card>
  );
}
