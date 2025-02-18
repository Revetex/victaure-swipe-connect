
import { Building2, GraduationCap, Calendar } from "lucide-react";
import { EducationEntry } from "@/types/profile";

interface EducationDisplayProps {
  education: EducationEntry;
  formatDate: (date: string | undefined) => string;
}

export function EducationDisplay({ education, formatDate }: EducationDisplayProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">{education.school_name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
        <p>{education.degree}</p>
      </div>
      {education.description && (
        <p className="text-muted-foreground pl-6">{education.description}</p>
      )}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>
          {formatDate(education.start_date)} - {formatDate(education.end_date) || "Présent"}
        </span>
      </div>
    </>
  );
}
