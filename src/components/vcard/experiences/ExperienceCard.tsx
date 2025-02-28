import { Experience } from "@/types/profile";
import { Building2, Briefcase, Calendar } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

interface ExperienceCardProps {
  exp: Experience;
}

export function ExperienceCard({ exp }: ExperienceCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 shrink-0" />
        <p className="font-medium">
          {exp.company || "Entreprise non définie"}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 shrink-0" />
        <p>{exp.position || "Poste non défini"}</p>
      </div>
      
      {exp.description && (
        <p className="pl-6 text-sm text-muted-foreground">
          {exp.description}
        </p>
      )}
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4 shrink-0" />
        <span>
          {exp.start_date ? formatDate(exp.start_date) : "?"} 
          {" - "}
          {exp.end_date ? formatDate(exp.end_date) : "Présent"}
        </span>
      </div>
    </div>
  );
}