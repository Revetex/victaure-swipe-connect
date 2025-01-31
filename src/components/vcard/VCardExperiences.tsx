import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VCardSection } from "@/components/VCardSection";
import { Briefcase, Plus, Trash2 } from "lucide-react";
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
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    description: ""
  });

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.position) {
      toast.error("Veuillez remplir au moins l'entreprise et le poste");
      return;
    }

    const experience: Experience = {
      id: crypto.randomUUID(),
      company: newExperience.company,
      position: newExperience.position,
      start_date: newExperience.start_date || null,
      end_date: newExperience.end_date || null,
      description: newExperience.description || null
    };

    setProfile({
      ...profile,
      experiences: [...(profile.experiences || []), experience]
    });

    setNewExperience({
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: ""
    });
    
    toast.success("Expérience ajoutée avec succès");
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: profile.experiences?.filter(exp => exp.id !== id) || []
    });
    toast.success("Expérience supprimée");
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
      icon={<Briefcase className="h-5 w-5" style={{ color: selectedStyle.colors.primary }} />}
    >
      <div className="space-y-6 max-w-3xl mx-auto">
        <AnimatePresence>
          {profile.experiences?.map((experience) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-6 rounded-lg bg-white/5 backdrop-blur-sm space-y-2 border border-indigo-500/20"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h4 
                    className="font-medium text-base truncate" 
                    style={{ color: selectedStyle.colors.text.primary }}
                  >
                    {experience.position}
                  </h4>
                  <p 
                    className="text-sm font-medium mt-1" 
                    style={{ color: selectedStyle.colors.text.secondary }}
                  >
                    {experience.company}
                  </p>
                  {(experience.start_date || experience.end_date) && (
                    <p 
                      className="text-sm mt-2" 
                      style={{ color: selectedStyle.colors.text.muted }}
                    >
                      {formatDate(experience.start_date)}
                      {experience.end_date ? ` - ${formatDate(experience.end_date)}` : " - Présent"}
                    </p>
                  )}
                  {experience.description && (
                    <p 
                      className="text-sm mt-3 whitespace-pre-wrap" 
                      style={{ color: selectedStyle.colors.text.muted }}
                    >
                      {experience.description}
                    </p>
                  )}
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveExperience(experience.id)}
                    className="shrink-0 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-indigo-500/20"
          >
            <Input
              placeholder="Entreprise"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="bg-white/10 border-indigo-500/20"
            />
            <Input
              placeholder="Poste"
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              className="bg-white/10 border-indigo-500/20"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Date de début"
                value={newExperience.start_date}
                onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                className="bg-white/10 border-indigo-500/20"
              />
              <Input
                type="date"
                placeholder="Date de fin"
                value={newExperience.end_date}
                onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                className="bg-white/10 border-indigo-500/20"
              />
            </div>
            <Textarea
              placeholder="Description"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              className="bg-white/10 border-indigo-500/20 min-h-[100px]"
            />
            <Button
              onClick={handleAddExperience}
              className="w-full transition-colors"
              style={{ 
                backgroundColor: selectedStyle.colors.primary,
                color: '#fff'
              }}
              disabled={!newExperience.company || !newExperience.position}
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