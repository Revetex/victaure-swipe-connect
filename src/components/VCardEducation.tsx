import { VCardSection } from "./VCardSection";
import { GraduationCap, Building2, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducation({ profile, isEditing, setProfile }: VCardEducationProps) {
  const handleAddEducation = () => {
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
  };

  const handleRemoveEducation = (id: string) => {
    setProfile({
      ...profile,
      education: profile.education?.filter((edu) => edu.id !== id),
    });
    toast.success("Formation supprimée");
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      education: profile.education?.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <VCardSection
      title="Formation"
      icon={<GraduationCap className="h-5 w-5" />}
      variant="education"
    >
      <div className="space-y-6">
        {(profile.education || []).map((edu) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 space-y-4 border border-indigo-200/50 dark:border-indigo-800/30"
          >
            {isEditing ? (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-3 sm:mt-0" />
                  <Input
                    value={edu.school_name}
                    onChange={(e) =>
                      handleEducationChange(edu.id, "school_name", e.target.value)
                    }
                    placeholder="Nom de l'école"
                    className="flex-1 bg-white/50 dark:bg-white/5 border-indigo-200/50 dark:border-indigo-800/30 min-h-[44px]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <GraduationCap className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-3 sm:mt-0" />
                  <Input
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(edu.id, "degree", e.target.value)
                    }
                    placeholder="Diplôme"
                    className="flex-1 bg-white/50 dark:bg-white/5 border-indigo-200/50 dark:border-indigo-800/30 min-h-[44px]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-3 sm:mt-0" />
                    <Input
                      type="date"
                      value={edu.start_date || ""}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "start_date", e.target.value)
                      }
                      className="flex-1 bg-white/50 dark:bg-white/5 border-indigo-200/50 dark:border-indigo-800/30 min-h-[44px]"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-3 sm:mt-0" />
                    <Input
                      type="date"
                      value={edu.end_date || ""}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "end_date", e.target.value)
                      }
                      className="flex-1 bg-white/50 dark:bg-white/5 border-indigo-200/50 dark:border-indigo-800/30 min-h-[44px]"
                    />
                  </div>
                </div>
                <Textarea
                  value={edu.description || ""}
                  onChange={(e) =>
                    handleEducationChange(edu.id, "description", e.target.value)
                  }
                  placeholder="Description de la formation"
                  className="w-full bg-white/50 dark:bg-white/5 border-indigo-200/50 dark:border-indigo-800/30 min-h-[100px]"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveEducation(edu.id)}
                  className="absolute top-2 right-2 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-medium">{edu.school_name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <p>{edu.degree}</p>
                </div>
                {edu.description && (
                  <p className="text-muted-foreground pl-6">{edu.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
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
          >
            <Button
              onClick={handleAddEducation}
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white transition-colors duration-200 min-h-[44px]"
            >
              Ajouter une formation
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}