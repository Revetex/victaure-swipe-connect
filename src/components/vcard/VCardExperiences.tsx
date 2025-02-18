
import { Experience, UserProfile } from "@/types/profile";
import { transformToExperience } from "@/utils/profileTransformers";
import { ExperienceCard } from "./experiences/ExperienceCard";
import { ExperienceForm } from "./experiences/ExperienceForm";
import { generateWithAI } from "@/services/ai/openRouterService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({ profile, isEditing, setProfile }: VCardExperiencesProps) {
  const experiences = profile.experiences || [];

  const handleUpdateExperience = (exp: Experience) => {
    const updatedExperiences = experiences.map(e => 
      e.id === exp.id ? transformToExperience(exp) : e
    );
    setProfile({ ...profile, experiences: updatedExperiences });
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: experiences.filter(exp => exp.id !== id)
    });
  };

  const handleAddExperience = () => {
    const newExperience = transformToExperience({
      id: crypto.randomUUID(),
      company: '',
      position: '',
      profile_id: profile.id,
      start_date: null,
      end_date: null,
      description: null
    });

    setProfile({
      ...profile,
      experiences: [...experiences, newExperience]
    });
  };

  const handleGenerateDescription = async (exp: Experience) => {
    try {
      const dateDebut = new Date(exp.start_date || '').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      const dateFin = exp.end_date ? new Date(exp.end_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'présent';
      
      const prompt = `Génère une description concise et professionnelle pour un poste de ${exp.position} chez ${exp.company} 
        occupé de ${dateDebut} à ${dateFin}. Mets l'accent sur les responsabilités clés et réalisations principales.`;

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
