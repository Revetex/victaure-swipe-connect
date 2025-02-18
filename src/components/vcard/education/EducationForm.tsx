
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, GraduationCap, Calendar, X } from "lucide-react";
import { Education } from "@/types/profile";

interface EducationFormProps {
  education: Education;
  onEducationChange: (id: string, field: string, value: string) => void;
  onRemoveEducation: (id: string) => void;
}

export function EducationForm({ education, onEducationChange, onRemoveEducation }: EducationFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          value={education.school_name}
          onChange={(e) =>
            onEducationChange(education.id, "school_name", e.target.value)
          }
          placeholder="Nom de l'école"
          className="flex-1 bg-background/50 border-border/20 min-h-[44px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          value={education.degree}
          onChange={(e) =>
            onEducationChange(education.id, "degree", e.target.value)
          }
          placeholder="Diplôme"
          className="flex-1 bg-background/50 border-border/20 min-h-[44px]"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            type="date"
            value={education.start_date || ""}
            onChange={(e) =>
              onEducationChange(education.id, "start_date", e.target.value)
            }
            className="flex-1 bg-background/50 border-border/20 min-h-[44px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            type="date"
            value={education.end_date || ""}
            onChange={(e) =>
              onEducationChange(education.id, "end_date", e.target.value)
            }
            className="flex-1 bg-background/50 border-border/20 min-h-[44px]"
          />
        </div>
      </div>
      <Textarea
        value={education.description || ""}
        onChange={(e) =>
          onEducationChange(education.id, "description", e.target.value)
        }
        placeholder="Description de la formation"
        className="w-full bg-background/50 border-border/20 min-h-[100px]"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemoveEducation(education.id)}
        className="absolute top-2 right-2 text-muted-foreground"
        aria-label="Supprimer la formation"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
