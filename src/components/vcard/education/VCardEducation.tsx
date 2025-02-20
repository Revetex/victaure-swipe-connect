
import { VCardSection } from "@/components/VCardSection";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { EducationForm } from "./EducationForm";
import { EducationDisplay } from "./EducationDisplay";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducation({ profile, isEditing, setProfile }: VCardEducationProps) {
  const [error, setError] = useState<string | null>(null);

  const handleAddEducation = () => {
    try {
      const newEducation = {
        id: crypto.randomUUID(),
        school_name: "",
        degree: "",
        field_of_study: "",
        start_date: null,
        end_date: null,
        description: "",
      };

      setProfile({
        ...profile,
        education: [...(profile.education || []), newEducation],
      });
      toast.success("Formation ajoutée");
    } catch (err) {
      console.error("Erreur lors de l'ajout d'une formation:", err);
      setError("Impossible d'ajouter une formation pour le moment");
      toast.error("Erreur lors de l'ajout de la formation");
    }
  };

  const handleRemoveEducation = (id: string) => {
    try {
      setProfile({
        ...profile,
        education: profile.education?.filter((edu) => edu.id !== id),
      });
      toast.success("Formation supprimée");
    } catch (err) {
      console.error("Erreur lors de la suppression d'une formation:", err);
      setError("Impossible de supprimer la formation pour le moment");
      toast.error("Erreur lors de la suppression de la formation");
    }
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    try {
      setProfile({
        ...profile,
        education: profile.education?.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ),
      });
    } catch (err) {
      console.error("Erreur lors de la modification d'une formation:", err);
      setError("Impossible de modifier la formation pour le moment");
      toast.error("Erreur lors de la modification de la formation");
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    });
  };

  useEffect(() => {
    setError(null);
  }, [profile, isEditing]);

  if (error) {
    return (
      <VCardSection
        title="Formation"
        icon={<GraduationCap className="h-4 w-4" />}
        variant="education"
      >
        <div className="p-4 text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={() => setError(null)} 
            variant="ghost" 
            className="mt-2"
          >
            Réessayer
          </Button>
        </div>
      </VCardSection>
    );
  }

  return (
    <VCardSection
      title="Formation"
      icon={<GraduationCap className="h-4 w-4" />}
      variant="education"
    >
      <div className="w-full space-y-6 px-0">
        {(profile.education || []).map((edu) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-full bg-background/50 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-border/20"
          >
            {isEditing ? (
              <EducationForm
                education={edu}
                onEducationChange={handleEducationChange}
                onRemoveEducation={handleRemoveEducation}
              />
            ) : (
              <EducationDisplay
                education={edu}
                formatDate={formatDate}
              />
            )}
          </motion.div>
        ))}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full px-4 sm:px-0"
          >
            <Button
              onClick={handleAddEducation}
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors duration-200 min-h-[44px]"
            >
              Ajouter une formation
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}
