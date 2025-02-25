
import { VCardSection } from "./VCardSection";
import { GraduationCap, Building2, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile, Education } from "@/types/profile";
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
        profile_id: profile.id,
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

  return (
    <VCardSection
      title="Formation"
      icon={<GraduationCap className="h-4 w-4" />}
      variant="education"
    >
      <div className="w-full space-y-6">
        <div className="grid gap-6">
          {(profile.education || []).map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-500/20 dark:hover:border-purple-400/20 transition-colors duration-200"
            >
              {isEditing ? (
                <>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-purple-500" />
                      <Input
                        value={edu.school_name}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "school_name", e.target.value)
                        }
                        placeholder="Nom de l'école"
                        className="flex-1 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-500" />
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "degree", e.target.value)
                        }
                        placeholder="Diplôme"
                        className="flex-1 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <Input
                          type="date"
                          value={edu.start_date || ""}
                          onChange={(e) =>
                            handleEducationChange(edu.id, "start_date", e.target.value)
                          }
                          className="flex-1 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <Input
                          type="date"
                          value={edu.end_date || ""}
                          onChange={(e) =>
                            handleEducationChange(edu.id, "end_date", e.target.value)
                          }
                          className="flex-1 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
                        />
                      </div>
                    </div>

                    <Textarea
                      value={edu.description || ""}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "description", e.target.value)
                      }
                      placeholder="Description de la formation"
                      className="w-full bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 min-h-[100px]"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    <h3 className="font-medium text-lg">{edu.school_name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <p>{edu.degree}</p>
                  </div>
                  
                  {edu.description && (
                    <p className="text-sm text-muted-foreground/80 pl-6">
                      {edu.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date) || "Présent"}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleAddEducation}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Ajouter une formation
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}
