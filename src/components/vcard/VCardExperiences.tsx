
import { Experience } from "@/types/profile";
import { transformToExperience } from "@/utils/profileTransformers";
import { ExperienceCard } from "./experiences/ExperienceCard";
import { ExperienceForm } from "./experiences/ExperienceForm";
import { generateWithAI } from "@/services/ai/openRouterService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

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

  const handleGenerateDescription = async (exp: Experience) => {
    try {
      const prompt = `Génère une description professionnelle et détaillée pour le poste de ${exp.position} chez ${exp.company}. 
        La description doit inclure les responsabilités principales et les réalisations, en utilisant des verbes d'action.
        La description doit faire environ 3-4 phrases.`;

      const description = await generateWithAI(prompt);
      handleUpdateExperience({ ...exp, description });
      toast.success("Description générée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la génération de la description");
    }
  };

  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="relative group">
          {isEditing ? (
            <div className="p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-purple-200/20 dark:border-purple-500/20 transition-all duration-300 hover:shadow-lg">
              <ExperienceForm
                exp={exp}
                onUpdate={handleUpdateExperience}
                onRemove={handleRemoveExperience}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleGenerateDescription(exp)}
                className="mt-4 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Générer une description avec l'IA
              </Button>
            </div>
          ) : (
            <ExperienceCard exp={exp} />
          )}
        </div>
      ))}
      
      {isEditing && (
        <button
          onClick={handleAddExperience}
          className="w-full p-4 text-sm text-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
        >
          Ajouter une expérience
        </button>
      )}
    </div>
  );
}
