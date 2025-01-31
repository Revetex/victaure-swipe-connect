import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { VCardSection } from "@/components/VCardSection";
import { Briefcase, X, Building2, Calendar, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile, Experience } from "@/types/profile";
import { useVCardStyle } from "./VCardStyleContext";
import { toast } from "sonner";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({ profile, isEditing, setProfile }: VCardExperiencesProps) {
  const { selectedStyle } = useVCardStyle();

  const handleAddExperience = () => {
    setProfile({
      ...profile,
      experiences: [
        ...(profile.experiences || []),
        { 
          id: crypto.randomUUID(), 
          company: "", 
          position: "", 
          start_date: null, 
          end_date: null, 
          description: null,
          profile_id: profile.id 
        }
      ],
    });
    toast.success("Expérience ajoutée");
  };

  const handleRemoveExperience = (id: string) => {
    const newExperiences = [...(profile.experiences || [])].filter(exp => exp.id !== id);
    setProfile({ ...profile, experiences: newExperiences });
    toast.success("Expérience supprimée");
  };

  const handleReorder = (newOrder: Experience[]) => {
    setProfile({ ...profile, experiences: newOrder });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <VCardSection 
      title="Expériences professionnelles"
      icon={<Briefcase className="h-4 w-4" style={{ color: selectedStyle.colors.primary }} />}
    >
      <div className="space-y-6 max-w-3xl mx-auto">
        {isEditing ? (
          <Reorder.Group axis="y" values={profile.experiences || []} onReorder={handleReorder}>
            {(profile.experiences || []).map((exp: Experience) => (
              <Reorder.Item key={exp.id} value={exp}>
                <motion.div 
                  className="relative bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 space-y-4 border border-indigo-500/20"
                >
                  <div className="absolute top-4 left-2 cursor-move">
                    <GripVertical className="h-4 w-4" style={{ color: selectedStyle.colors.primary }} />
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                      <Input
                        value={exp.company}
                        onChange={(e) => {
                          const newExperiences = [...(profile.experiences || [])];
                          const expIndex = newExperiences.findIndex(e => e.id === exp.id);
                          newExperiences[expIndex] = { ...exp, company: e.target.value };
                          setProfile({ ...profile, experiences: newExperiences });
                        }}
                        placeholder="Nom de l'entreprise"
                        className="flex-1 bg-white/10 border-indigo-500/20 min-h-[44px]"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Briefcase className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                      <Input
                        value={exp.position}
                        onChange={(e) => {
                          const newExperiences = [...(profile.experiences || [])];
                          const expIndex = newExperiences.findIndex(e => e.id === exp.id);
                          newExperiences[expIndex] = { ...exp, position: e.target.value };
                          setProfile({ ...profile, experiences: newExperiences });
                        }}
                        placeholder="Poste"
                        className="flex-1 bg-white/10 border-indigo-500/20 min-h-[44px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                        <Input
                          type="date"
                          value={exp.start_date || ''}
                          onChange={(e) => {
                            const newExperiences = [...(profile.experiences || [])];
                            const expIndex = newExperiences.findIndex(e => e.id === exp.id);
                            newExperiences[expIndex] = { ...exp, start_date: e.target.value };
                            setProfile({ ...profile, experiences: newExperiences });
                          }}
                          className="flex-1 bg-white/10 border-indigo-500/20 min-h-[44px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                        <Input
                          type="date"
                          value={exp.end_date || ''}
                          onChange={(e) => {
                            const newExperiences = [...(profile.experiences || [])];
                            const expIndex = newExperiences.findIndex(e => e.id === exp.id);
                            newExperiences[expIndex] = { ...exp, end_date: e.target.value };
                            setProfile({ ...profile, experiences: newExperiences });
                          }}
                          className="flex-1 bg-white/10 border-indigo-500/20 min-h-[44px]"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <Textarea
                        value={exp.description || ''}
                        onChange={(e) => {
                          const newExperiences = [...(profile.experiences || [])];
                          const expIndex = newExperiences.findIndex(e => e.id === exp.id);
                          newExperiences[expIndex] = { ...exp, description: e.target.value };
                          setProfile({ ...profile, experiences: newExperiences });
                        }}
                        placeholder="Description du poste"
                        className="w-full bg-white/10 border-indigo-500/20 min-h-[100px]"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          (profile.experiences || []).map((exp: Experience) => (
            <motion.div 
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-white/5 backdrop-blur-sm rounded-lg p-4 sm:p-6 space-y-4 border border-indigo-500/20"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                <p className="font-medium" style={{ color: selectedStyle.colors.text.primary }}>
                  {exp.company || "Entreprise non définie"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                <p style={{ color: selectedStyle.colors.text.secondary }}>
                  {exp.position || "Poste non défini"}
                </p>
              </div>
              {exp.description && (
                <p className="pl-6" style={{ color: selectedStyle.colors.text.muted }}>
                  {exp.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                <span style={{ color: selectedStyle.colors.text.muted }}>
                  {exp.start_date ? formatDate(exp.start_date) : "?"} 
                  {" - "}
                  {exp.end_date ? formatDate(exp.end_date) : "Présent"}
                </span>
              </div>
            </motion.div>
          ))
        )}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={handleAddExperience} 
              className="w-full transition-colors duration-200 min-h-[44px]"
              style={{ 
                backgroundColor: selectedStyle.colors.primary,
                color: '#fff'
              }}
            >
              Ajouter une expérience
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}