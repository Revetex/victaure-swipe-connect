
import { useState } from "react";
import { UserProfile, Experience } from "@/types/profile";
import { Briefcase, Plus, Trash, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface VCardExperienceSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperienceSection({
  profile,
  isEditing,
  setProfile,
}: VCardExperienceSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    position: "",
    company: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const handleAddExperience = () => {
    if (!newExperience.position || !newExperience.company) return;

    const experienceEntry: Experience = {
      id: crypto.randomUUID(),
      profile_id: profile.id,
      position: newExperience.position || "",
      company: newExperience.company || "",
      start_date: newExperience.start_date || null,
      end_date: newExperience.end_date || null,
      description: newExperience.description || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProfile({
      ...profile,
      experiences: [...(profile.experiences || []), experienceEntry],
    });

    // Reset form
    setNewExperience({
      position: "",
      company: "",
      start_date: "",
      end_date: "",
      description: "",
    });
    setShowAddForm(false);
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: (profile.experiences || []).filter((exp) => exp.id !== id),
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
          <Briefcase className="h-4 w-4 text-primary/80" />
          <h3 className="font-medium text-foreground/90">Expérience</h3>
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
                      placeholder="Poste *"
                      value={newExperience.position || ""}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          position: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Entreprise *"
                      value={newExperience.company || ""}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          company: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Input
                      type="date"
                      placeholder="Date de début"
                      value={newExperience.start_date || ""}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
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
                      value={newExperience.end_date || ""}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
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
                    value={newExperience.description || ""}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
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
                    onClick={handleAddExperience}
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
            {profile.experiences && profile.experiences.length > 0 ? (
              profile.experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative pb-5",
                    index !== profile.experiences!.length - 1 &&
                      "border-b border-white/5"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground/90">{exp.position}</h4>
                      <p className="text-sm text-foreground/80">{exp.company}</p>
                      {(exp.start_date || exp.end_date) && (
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>
                            {formatDate(exp.start_date)}
                            {exp.end_date
                              ? ` - ${formatDate(exp.end_date)}`
                              : " - Présent"}
                          </span>
                        </div>
                      )}
                      {exp.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExperience(exp.id)}
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
                Aucune expérience ajoutée
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
