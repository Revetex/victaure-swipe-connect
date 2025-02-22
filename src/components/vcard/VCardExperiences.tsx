
import { Experience } from "@/types/profile";
import { transformToExperience } from "@/utils/profileTransformers";
import { ExperienceCard } from "./experiences/ExperienceCard";
import { ExperienceForm } from "./experiences/ExperienceForm";
import { VCardSection } from "@/components/VCardSection";
import { Briefcase, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface VCardExperiencesProps {
  experiences: Experience[];
  isEditing: boolean;
  onUpdate?: (experiences: Experience[]) => void;
}

export function VCardExperiences({ experiences, isEditing, onUpdate }: VCardExperiencesProps) {
  const handleUpdateExperience = (exp: Experience) => {
    if (!onUpdate) return;
    
    const updatedExperiences = experiences.map(e => 
      e.id === exp.id ? transformToExperience(exp) : e
    );
    onUpdate(updatedExperiences);
  };

  const handleRemoveExperience = (id: string) => {
    if (!onUpdate) return;
    onUpdate(experiences.filter(exp => exp.id !== id));
  };

  const handleAddExperience = () => {
    if (!onUpdate) return;
    
    const newExperience = transformToExperience({
      id: crypto.randomUUID(),
      company: '',
      position: '',
      profile_id: '',
      start_date: null,
      end_date: null,
      description: null
    });

    onUpdate([...experiences, newExperience]);
  };

  return (
    <VCardSection
      title="Expérience"
      icon={<Briefcase className="h-4 w-4" />}
      variant="experience"
    >
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative">
            {isEditing ? (
              <ExperienceForm
                exp={exp}
                onUpdate={handleUpdateExperience}
                onRemove={handleRemoveExperience}
              />
            ) : (
              <ExperienceCard exp={exp} />
            )}
          </div>
        ))}
        
        {isEditing && (
          <button
            onClick={handleAddExperience}
            className={cn(
              "w-full p-4 text-sm font-medium",
              "flex items-center justify-center gap-2",
              "bg-gradient-to-r from-primary/10 to-primary/5",
              "hover:from-primary/20 hover:to-primary/10",
              "text-primary/80 hover:text-primary",
              "rounded-lg shadow-sm",
              "border border-primary/10 hover:border-primary/20",
              "transition-all duration-300",
              "hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter une expérience</span>
          </button>
        )}
      </div>
    </VCardSection>
  );
}
