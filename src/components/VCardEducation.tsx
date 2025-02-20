
import { VCardSection } from "./VCardSection";
import { GraduationCap, Building2, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducation({ profile, isEditing, setProfile }: VCardEducationProps) {
  const [error, setError] = useState<string | null>(null);

  const handleAddEducation = () => {
    try {
      const newEducation: Education = {
        id: crypto.randomUUID(),
        profile_id: profile.id, // Ajout du profile_id
        school_name: "",
        degree: "",
        field_of_study: "",
        start_date: null,
        end_date: null,
        description: null
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

  // Reset error when props change
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
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <Input
                      value={edu.school_name}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "school_name", e.target.value)
                      }
                      placeholder="Nom de l'école"
                      className="flex-1 bg-background/50 border-border/20 min-h-[44px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "degree", e.target.value)
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
                        value={edu.start_date || ""}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "start_date", e.target.value)
                        }
                        className="flex-1 bg-background/50 border-border/20 min-h-[44px]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Input
                        type="date"
                        value={edu.end_date || ""}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "end_date", e.target.value)
                        }
                        className="flex-1 bg-background/50 border-border/20 min-h-[44px]"
                      />
                    </div>
                  </div>
                  <Textarea
                    value={edu.description || ""}
                    onChange={(e) =>
                      handleEducationChange(edu.id, "description", e.target.value)
                    }
                    placeholder="Description de la formation"
                    className="w-full bg-background/50 border-border/20 min-h-[100px]"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="absolute top-2 right-2 text-muted-foreground"
                    aria-label="Supprimer la formation"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">{edu.school_name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <p>{edu.degree}</p>
                </div>
                {edu.description && (
                  <p className="text-muted-foreground pl-6">{edu.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date) || "Présent"}
                  </span>
                </div>
              </>
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

