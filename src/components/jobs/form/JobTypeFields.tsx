import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobTypeFieldsProps {
  contractType: string;
  experienceLevel: string;
  onChange: (field: string, value: string) => void;
}

export function JobTypeFields({
  contractType,
  experienceLevel,
  onChange,
}: JobTypeFieldsProps) {
  const contractTypes = [
    "CDI",
    "CDD",
    "Freelance",
    "Stage",
    "Alternance",
    "Temps partiel",
    "Temps plein",
    "Intérim",
    "Saisonnier"
  ];

  const experienceLevels = [
    "Débutant",
    "Junior (1-3 ans)",
    "Intermédiaire (3-5 ans)",
    "Senior (5-8 ans)",
    "Expert (8+ ans)",
    "Lead",
    "Directeur"
  ];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="contract_type">Type de contrat</Label>
        <Select
          value={contractType}
          onValueChange={(value) => onChange("contract_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type de contrat" />
          </SelectTrigger>
          <SelectContent>
            {contractTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience_level">Niveau d'expérience</Label>
        <Select
          value={experienceLevel}
          onValueChange={(value) => onChange("experience_level", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un niveau d'expérience" />
          </SelectTrigger>
          <SelectContent>
            {experienceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}