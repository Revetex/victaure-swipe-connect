
import { MapPin, Building2, ArrowUpDown, BriefcaseIcon, Clock, DollarSign, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface JobsFiltersProps {
  selectedLocation: string;
  selectedCompanyType: string;
  sortOrder: "recent" | "salary";
  locations: string[];
  onLocationChange: (location: string) => void;
  onCompanyTypeChange: (type: string) => void;
  onSortOrderChange: (order: "recent" | "salary") => void;
  experienceLevel: string;
  onExperienceLevelChange: (level: string) => void;
  contractType: string;
  onContractTypeChange: (type: string) => void;
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  datePosted: string;
  onDatePostedChange: (date: string) => void;
  onReset: () => void;
}

export function JobsFilters({
  selectedLocation,
  selectedCompanyType,
  sortOrder,
  locations,
  onLocationChange,
  onCompanyTypeChange,
  onSortOrderChange,
  experienceLevel,
  onExperienceLevelChange,
  contractType,
  onContractTypeChange,
  salaryRange,
  onSalaryRangeChange,
  datePosted,
  onDatePostedChange,
  onReset
}: JobsFiltersProps) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 space-y-4"
    >
      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto">
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger className="w-[200px]">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les localisations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select value={selectedCompanyType} onValueChange={onCompanyTypeChange}>
            <SelectTrigger className="w-[200px]">
              <Building2 className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Type d'entreprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les types d'entreprises</SelectItem>
              <SelectItem value="internal">Entreprises Victaure</SelectItem>
              <SelectItem value="external">Entreprises externes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
            <SelectTrigger className="w-[200px]">
              <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Niveau d'expérience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les niveaux</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="mid-level">Intermédiaire</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select value={contractType} onValueChange={onContractTypeChange}>
            <SelectTrigger className="w-[200px]">
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Type de contrat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les contrats</SelectItem>
              <SelectItem value="full-time">Temps plein</SelectItem>
              <SelectItem value="part-time">Temps partiel</SelectItem>
              <SelectItem value="contract">Contrat</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select value={datePosted} onValueChange={onDatePostedChange}>
            <SelectTrigger className="w-[200px]">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Date de publication" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les dates</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-auto">
          <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as "recent" | "salary")}>
            <SelectTrigger className="w-[200px]">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récents</SelectItem>
              <SelectItem value="salary">Meilleurs salaires</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Fourchette de salaire
          </label>
          <span className="text-sm text-muted-foreground">
            {salaryRange[0].toLocaleString()}$ - {salaryRange[1].toLocaleString()}$
          </span>
        </div>
        <Slider
          min={0}
          max={200000}
          step={5000}
          value={[salaryRange[0], salaryRange[1]]}
          onValueChange={(value) => onSalaryRangeChange(value as [number, number])}
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={onReset}
          className="text-sm"
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </motion.div>
  );
}
