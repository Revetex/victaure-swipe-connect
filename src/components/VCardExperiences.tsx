import { useState } from "react";
import { VCardSection } from "./VCardSection";
import { Briefcase, Plus, X, Building2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({ profile, isEditing, setProfile }: VCardExperiencesProps) {
  const handleAddExperience = () => {
    if (!profile) return;

    const experience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: ""
    };

    setProfile({
      ...profile,
      experiences: [...(profile.experiences || []), experience]
    });
    toast.success("Expérience ajoutée");
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: profile.experiences?.filter(exp => exp.id !== id) || []
    });
    toast.success("Expérience supprimée");
  };

  const handleReorder = (newOrder: any[]) => {
    setProfile({
      ...profile,
      experiences: newOrder
    });
  };

  return (
    <VCardSection
      title="Expériences professionnelles"
      icon={<Briefcase className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <AnimatePresence>
          {isEditing ? (
            <Reorder.Group axis="y" values={profile.experiences || []} onReorder={handleReorder}>
              {profile.experiences?.map((experience) => (
                <Reorder.Item key={experience.id} value={experience}>
                  <motion.div
                    className="relative p-4 rounded-lg bg-card/40 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 space-y-3"
                  >
                    <Input
                      value={experience.company}
                      onChange={(e) => {
                        const newExperiences = profile.experiences?.map(exp =>
                          exp.id === experience.id ? { ...exp, company: e.target.value } : exp
                        );
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                      placeholder="Entreprise"
                      className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                    />
                    <Input
                      value={experience.position}
                      onChange={(e) => {
                        const newExperiences = profile.experiences?.map(exp =>
                          exp.id === experience.id ? { ...exp, position: e.target.value } : exp
                        );
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                      placeholder="Poste"
                      className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={experience.start_date || ""}
                        onChange={(e) => {
                          const newExperiences = profile.experiences?.map(exp =>
                            exp.id === experience.id ? { ...exp, start_date: e.target.value } : exp
                          );
                          setProfile({ ...profile, experiences: newExperiences });
                        }}
                        className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                      />
                      <Input
                        type="date"
                        value={experience.end_date || ""}
                        onChange={(e) => {
                          const newExperiences = profile.experiences?.map(exp =>
                            exp.id === experience.id ? { ...exp, end_date: e.target.value } : exp
                          );
                          setProfile({ ...profile, experiences: newExperiences });
                        }}
                        className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                      />
                    </div>
                    <Textarea
                      value={experience.description || ""}
                      onChange={(e) => {
                        const newExperiences = profile.experiences?.map(exp =>
                          exp.id === experience.id ? { ...exp, description: e.target.value } : exp
                        );
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                      placeholder="Description du poste"
                      className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExperience(experience.id)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          ) : (
            profile.experiences?.map((experience) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative p-4 rounded-lg bg-card/40 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary/80" />
                  <h4 className="font-medium text-foreground/90">{experience.position}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{experience.company}</p>
                {(experience.start_date || experience.end_date) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {experience.start_date && new Date(experience.start_date).toLocaleDateString()}
                      {experience.end_date ? ` - ${new Date(experience.end_date).toLocaleDateString()}` : " - Présent"}
                    </span>
                  </div>
                )}
                {experience.description && (
                  <p className="text-sm text-muted-foreground/90">{experience.description}</p>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <Button
              onClick={handleAddExperience}
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une expérience
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}