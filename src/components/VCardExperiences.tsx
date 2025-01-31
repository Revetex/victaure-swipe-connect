import { useState } from "react";
import { VCardSection } from "./VCardSection";
import { Briefcase, X, Building2, Calendar, Plus, GripVertical } from "lucide-react";
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
      icon={<Briefcase className="h-5 w-5 text-[#7E69AB]" />}
    >
      <div className="space-y-6">
        <AnimatePresence>
          {isEditing ? (
            <Reorder.Group axis="y" values={profile.experiences || []} onReorder={handleReorder}>
              {profile.experiences?.map((experience) => (
                <Reorder.Item key={experience.id} value={experience}>
                  <motion.div
                    className="relative p-4 rounded-lg bg-white/5 space-y-2 border border-[#9b87f5]/20"
                  >
                    <div className="absolute top-4 left-2 cursor-move">
                      <GripVertical className="h-4 w-4 text-[#7E69AB]" />
                    </div>
                    <div className="ml-6">
                      <Input
                        value={experience.company}
                        onChange={(e) => {
                          const newExperiences = profile.experiences?.map(exp =>
                            exp.id === experience.id ? { ...exp, company: e.target.value } : exp
                          );
                          setProfile({ ...profile, experiences: newExperiences });
                        }}
                        placeholder="Entreprise"
                        className="mb-2 bg-white/10 border-[#9b87f5]/20 text-[#9b87f5] placeholder:text-[#7E69AB]/50"
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
                        className="mb-2 bg-white/10 border-[#9b87f5]/20 text-[#9b87f5] placeholder:text-[#7E69AB]/50"
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
                          className="bg-white/10 border-[#9b87f5]/20 text-[#9b87f5]"
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
                          className="bg-white/10 border-[#9b87f5]/20 text-[#9b87f5]"
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
                        className="bg-white/10 border-[#9b87f5]/20 text-[#9b87f5] placeholder:text-[#7E69AB]/50"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExperience(experience.id)}
                        className="absolute top-2 right-2 text-[#7E69AB] hover:text-[#9b87f5]"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
                className="relative p-4 rounded-lg bg-white/5 space-y-2 border border-[#9b87f5]/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-[#9b87f5]">{experience.position}</h4>
                    <p className="text-sm text-[#7E69AB]">{experience.company}</p>
                    {experience.start_date && (
                      <p className="text-sm text-[#6E59A5]">
                        {new Date(experience.start_date).toLocaleDateString()} - 
                        {experience.end_date 
                          ? new Date(experience.end_date).toLocaleDateString()
                          : "Présent"}
                      </p>
                    )}
                  </div>
                </div>
                {experience.description && (
                  <p className="text-sm text-[#7E69AB]">{experience.description}</p>
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
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors duration-200"
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