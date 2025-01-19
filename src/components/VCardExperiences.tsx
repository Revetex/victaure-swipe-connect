import { VCardSection } from "./VCardSection";
import { Briefcase } from "lucide-react";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardButton } from "./vcard/VCardButton";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Experience {
  title: string;
  company: string;
  year: string;
}

interface VCardExperiencesProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardExperiences({
  profile,
  isEditing,
  setProfile,
}: VCardExperiencesProps) {
  const { selectedStyle } = useVCardStyle();

  const handleAddExperience = () => {
    setProfile({
      ...profile,
      experiences: [
        ...(profile.experiences || []),
        { title: "", company: "", year: "" },
      ],
    });
    toast.success("Expérience ajoutée");
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = [...(profile.experiences || [])];
    newExperiences.splice(index, 1);
    setProfile({ ...profile, experiences: newExperiences });
    toast.success("Expérience supprimée");
  };

  return (
    <VCardSection 
      title="Expériences"
      icon={<Briefcase className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />}
    >
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {(profile.experiences || []).map((exp: Experience, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative border-l-2 pl-4 py-3 space-y-3 hover:bg-white/5 rounded-r transition-colors"
              style={{ 
                borderColor: `${selectedStyle.colors.primary}30`,
                color: selectedStyle.colors.text.primary
              }}
            >
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-lg" style={{ color: selectedStyle.colors.text.primary }}>{exp.title || "Titre non défini"}</p>
                    <p style={{ color: selectedStyle.colors.text.secondary }}>{exp.company || "Entreprise non définie"}</p>
                  </div>
                  <p className="text-sm" style={{ color: selectedStyle.colors.text.muted }}>{exp.year || "Année non définie"}</p>
                  <VCardButton
                    variant="outline"
                    onClick={() => handleRemoveExperience(index)}
                    className="hover:text-red-400 transition-colors"
                  >
                    Supprimer
                  </VCardButton>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-lg" style={{ color: selectedStyle.colors.text.primary }}>{exp.title || "Titre non défini"}</p>
                    <p style={{ color: selectedStyle.colors.text.secondary }}>{exp.company || "Entreprise non définie"}</p>
                  </div>
                  <p className="text-sm" style={{ color: selectedStyle.colors.text.muted }}>{exp.year || "Année non définie"}</p>
                </>
              )}
            </motion.div>
          ))}
          {isEditing && (
            <VCardButton
              onClick={handleAddExperience}
              variant="default"
              className="w-full mt-4"
            >
              Ajouter une expérience
            </VCardButton>
          )}
        </div>
      </AnimatePresence>
    </VCardSection>
  );
}
