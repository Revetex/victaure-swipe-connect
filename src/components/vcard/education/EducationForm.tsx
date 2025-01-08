import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, GraduationCap, Building2, Calendar } from "lucide-react";
import { Education } from "@/types/profile";

interface EducationFormProps {
  education: Education;
  onUpdate: (updatedEducation: Education) => void;
  onRemove: () => void;
}

export function EducationForm({ education, onUpdate, onRemove }: EducationFormProps) {
  return (
    <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-indigo-500/20 hover:border-indigo-500/30 transition-colors">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
        <Input
          value={education.school_name}
          onChange={(e) => onUpdate({ ...education, school_name: e.target.value })}
          placeholder="Nom de l'école"
          className="flex-1 bg-white/10 border-indigo-500/20"
        />
      </div>
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
        <Input
          value={education.degree}
          onChange={(e) => onUpdate({ ...education, degree: e.target.value })}
          placeholder="Diplôme"
          className="flex-1 bg-white/10 border-indigo-500/20"
        />
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={education.field_of_study}
          onChange={(e) => onUpdate({ ...education, field_of_study: e.target.value })}
          placeholder="Domaine d'études"
          className="flex-1 bg-white/10 border-indigo-500/20"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
          <Input
            type="date"
            value={education.start_date}
            onChange={(e) => onUpdate({ ...education, start_date: e.target.value })}
            className="flex-1 bg-white/10 border-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
          <Input
            type="date"
            value={education.end_date}
            onChange={(e) => onUpdate({ ...education, end_date: e.target.value })}
            className="flex-1 bg-white/10 border-indigo-500/20"
          />
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-indigo-400 hover:text-red-400 transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}