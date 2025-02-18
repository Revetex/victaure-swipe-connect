
import { Experience } from "@/types/profile";
import { transformToExperience } from "@/utils/profileTransformers";
import { ExperienceCard } from "./experiences/ExperienceCard";
import { ExperienceForm } from "./experiences/ExperienceForm";

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
          className="w-full p-4 text-sm text-center text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
        >
          Ajouter une expérience
        </button>
      )}
    </div>
  );
}
