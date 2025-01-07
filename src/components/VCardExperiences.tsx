import { useState } from "react";
import { VCardSection } from "./VCardSection";
import { Briefcase, X, Building2, Calendar, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <VCardSection
      title="Expériences professionnelles"
      icon={<Briefcase className="h-5 w-5 text-indigo-400" />}
    >
      <div className="space-y-6">
        <AnimatePresence>
          {profile.experiences?.map((experience) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-4 rounded-lg bg-white/5 space-y-2"
            >
              {isEditing ? (
                <>
                  <Input
                    value={experience.company}
                    onChange={(e) => {
                      const newExperiences = profile.experiences?.map(exp =>
                        exp.id === experience.id ? { ...exp, company: e.target.value } : exp
                      );
                      setProfile({ ...profile, experiences: newExperiences });
                    }}
                    placeholder="Entreprise"
                    className="mb-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
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
                    className="mb-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <Input
                      type="date"
                      value={experience.start_date || ""}
                      onChange={(e) => {
                        const newExperiences = profile.experiences?.map(exp =>
                          exp.id === experience.id ? { ...exp, start_date: e.target.value } : exp
                        );
                        setProfile({ ...profile, experiences: newExperiences });
                      }}
                      className="bg-white/10 border-white/20 text-white"
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
                      className="bg-white/10 border-white/20 text-white"
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExperience(experience.id)}
                    className="absolute top-2 right-2 text-white/60 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white">{experience.position}</h4>
                      <p className="text-sm text-white/80">{experience.company}</p>
                      {experience.start_date && (
                        <p className="text-sm text-white/60">
                          {new Date(experience.start_date).toLocaleDateString()} - 
                          {experience.end_date 
                            ? new Date(experience.end_date).toLocaleDateString()
                            : "Présent"}
                        </p>
                      )}
                    </div>
                  </div>
                  {experience.description && (
                    <p className="text-sm text-white/70">{experience.description}</p>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <Button
              onClick={handleAddExperience}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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