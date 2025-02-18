import { Experience } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Briefcase, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExperienceFormProps {
  exp: Experience;
  onUpdate: (exp: Experience) => void;
  onRemove: (id: string) => void;
}

export function ExperienceForm({ exp, onUpdate, onRemove }: ExperienceFormProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          value={exp.company}
          onChange={(e) => onUpdate({ ...exp, company: e.target.value })}
          placeholder="Nom de l'entreprise"
          className="flex-1 min-h-[40px]"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          value={exp.position}
          onChange={(e) => onUpdate({ ...exp, position: e.target.value })}
          placeholder="Poste"
          className="flex-1 min-h-[40px]"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            type="date"
            value={exp.start_date || ''}
            onChange={(e) => onUpdate({ ...exp, start_date: e.target.value })}
            className="flex-1 min-h-[40px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            type="date"
            value={exp.end_date || ''}
            onChange={(e) => onUpdate({ ...exp, end_date: e.target.value })}
            className="flex-1 min-h-[40px]"
          />
        </div>
      </div>
      
      <Textarea
        value={exp.description || ''}
        onChange={(e) => onUpdate({ ...exp, description: e.target.value })}
        placeholder="Description du poste"
        className="w-full min-h-[80px]"
      />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(exp.id)}
        className="absolute top-2 right-2 hover:bg-destructive/20 hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}