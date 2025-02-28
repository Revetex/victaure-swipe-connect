
import { useState } from "react";
import { UserProfile, Education } from "@/types/profile";
import { GraduationCap, Plus, Trash, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VCardEducationSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducationSection({
  profile,
  isEditing,
  setProfile,
}: VCardEducationSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
    school_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const handleAddEducation = () => {
    if (!newEducation.school_name || !newEducation.degree) return;

    const educationEntry: Education = {
      id: crypto.randomUUID(),
      profile_id: profile.id,
      school_name: newEducation.school_name || "",
      degree: newEducation.degree || "",
      field_of_study: newEducation.field_of_study || "",
      start_date: newEducation.start_date || null,
      end_date: newEducation.end_date || null,
      description: newEducation.description || null,
    };

    setProfile({
      ...profile,
      education: [...(profile.education || []), educationEntry],
    });

    // Reset form
    setNewEducation({
      school_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: "",
    });
    setShowAddForm(false);
  };

  const handleRemoveEducation = (id: string) => {
    setProfile({
      ...profile,
      education: (profile.education || []).filter((edu) => edu.id !== id),
    });
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMMM yyyy", { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/5 dark:bg-black/10 backdrop-blur-sm border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary/80" />
          <h3 className="font-medium text-foreground/90">Formation</h3>
        </div>
        
        {isEditing && !showAddForm && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="text-xs h-8 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
          >
            <Plus className="mr-1 h-3 w-3" />
            Ajouter
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {showAddForm && isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3 mb-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Input
                      placeholder="École ou université *"
                      value={newEducation.school_name || ""}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          school_name: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Diplôme *"
                      value={newEducation.degree || ""}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          degree: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div>
                  <Input
                    placeholder="Domaine d'études"
                    value={newEducation.field_of_study || ""}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        field_of_study: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Input
                      type="date"
                      placeholder="Date de début"
                      value={newEducation.start_date || ""}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          start_date: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      placeholder="Date de fin"
                      value={newEducation.end_date || ""}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          end_date: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div>
                  <Textarea
                    placeholder="Description (optionnel)"
                    value={newEducation.description || ""}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        description: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                    className="bg-white/5 border-white/10"
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleAddEducation}
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-5">
          <AnimatePresence>
            {profile.education && profile.education.length > 0 ? (
              profile.education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative pb-5",
                    index !== profile.education!.length - 1 &&
                      "border-b border-white/5"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground/90">{edu.school_name}</h4>
                      <p className="text-sm text-foreground/80">{edu.degree}</p>
                      {edu.field_of_study && (
                        <p className="text-sm text-muted-foreground italic">
                          {edu.field_of_study}
                        </p>
                      )}
                      {(edu.start_date || edu.end_date) && (
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>
                            {formatDate(edu.start_date)}
                            {edu.end_date
                              ? ` - ${formatDate(edu.end_date)}`
                              : " - Présent"}
                          </span>
                        </div>
                      )}
                      {edu.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {edu.description}
                        </p>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Aucune formation ajoutée
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
