
import { useState } from "react";
import { Experience } from "@/types/profile";
import { ExperienceForm } from "../experiences/ExperienceForm";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExperienceCard } from "../experiences/ExperienceCard";
import { VCardSectionHeader } from "./VCardSectionHeader";

export interface VCardExperienceSectionProps {
  experiences: Experience[];
  isEditing: boolean;
  onUpdateExperiences: (experiences: Experience[]) => void;
}

export function VCardExperienceSection({
  experiences,
  isEditing,
  onUpdateExperiences,
}: VCardExperienceSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experienceBeingEdited, setExperienceBeingEdited] = useState<Experience | null>(null);

  const handleAddExperience = (experience: Experience) => {
    if (experienceBeingEdited) {
      // Mise à jour d'une expérience existante
      const updatedExperiences = experiences.map(exp => 
        exp.id === experienceBeingEdited.id ? experience : exp
      );
      onUpdateExperiences(updatedExperiences);
    } else {
      // Ajout d'une nouvelle expérience
      onUpdateExperiences([...experiences, experience]);
    }
    setIsModalOpen(false);
    setExperienceBeingEdited(null);
  };

  const handleDeleteExperience = (id: string) => {
    onUpdateExperiences(experiences.filter(exp => exp.id !== id));
  };

  const handleEditExperience = (experience: Experience) => {
    setExperienceBeingEdited(experience);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <VCardSectionHeader 
        title="Expériences" 
        subtitle="Votre parcours professionnel"
        isEditing={isEditing}
      />
      
      <div className="mt-2 space-y-4">
        {experiences && experiences.length > 0 ? (
          experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onDelete={isEditing ? () => handleDeleteExperience(experience.id) : undefined}
              onEdit={isEditing ? () => handleEditExperience(experience) : undefined}
            />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground bg-muted/10 rounded-lg">
            Vous n'avez pas encore ajouté d'expérience.
          </div>
        )}

        {isEditing && (
          <div className="flex justify-center mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 border-dashed"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Ajouter une expérience
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <ExperienceForm 
            experience={experienceBeingEdited || undefined}
            onSubmit={handleAddExperience}
            onCancel={() => {
              setIsModalOpen(false);
              setExperienceBeingEdited(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
