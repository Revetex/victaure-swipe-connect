import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VCardSection } from "./VCardSection";
import { Briefcase, Plus, Trash2, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UserProfile, Experience } from "@/types/profile";
import { toast } from "sonner";

interface VCardExperiencesProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperiences({
  profile,
  isEditing,
  setProfile,
}: VCardExperiencesProps) {
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    company: "",
    position: "",
    start_date: "",
    end_date: "",
    description: ""
  });
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.position) {
      toast.error("Le nom de l'entreprise et le poste sont requis");
      return;
    }

    const experience: Experience = {
      id: crypto.randomUUID(),
      company: newExperience.company,
      position: newExperience.position,
      start_date: newExperience.start_date || null,
      end_date: isCurrentJob ? null : newExperience.end_date || null,
      description: newExperience.description || null
    };

    const updatedExperiences = [...(profile.experiences || []), experience];
    
    // Trier les expériences par date de début (plus récente en premier)
    updatedExperiences.sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
      const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
      return dateB - dateA;
    });

    setProfile({
      ...profile,
      experiences: updatedExperiences
    });

    setNewExperience({
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: ""
    });
    setIsCurrentJob(false);

    toast.success("Expérience ajoutée");
  };

  const handleRemoveExperience = (id: string) => {
    setProfile({
      ...profile,
      experiences: profile.experiences?.filter(exp => exp.id !== id) || []
    });
    toast.success("Expérience supprimée");
  };

  const handleMoveExperience = (id: string, direction: 'up' | 'down') => {
    if (!profile.experiences) return;
    
    const currentIndex = profile.experiences.findIndex(exp => exp.id === id);
    if (currentIndex === -1) return;
    
    const newExperiences = [...profile.experiences];
    if (direction === 'up' && currentIndex > 0) {
      [newExperiences[currentIndex], newExperiences[currentIndex - 1]] = 
      [newExperiences[currentIndex - 1], newExperiences[currentIndex]];
    } else if (direction === 'down' && currentIndex < newExperiences.length - 1) {
      [newExperiences[currentIndex], newExperiences[currentIndex + 1]] = 
      [newExperiences[currentIndex + 1], newExperiences[currentIndex]];
    }
    
    setProfile({
      ...profile,
      experiences: newExperiences
    });
  };

  return (
    <VCardSection
      title="Expériences professionnelles"
      icon={<Briefcase className="h-5 w-5 text-muted-foreground" />}
    >
      <div className="space-y-6">
        <AnimatePresence>
          {profile.experiences?.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-4 rounded-lg bg-white/5 space-y-2 border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <h4 className="font-medium text-white">{experience.position}</h4>
                  </div>
                  <p className="text-sm text-white/80">{experience.company}</p>
                  {experience.start_date && (
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(experience.start_date).toLocaleDateString()} - 
                        {experience.end_date 
                          ? new Date(experience.end_date).toLocaleDateString()
                          : "Présent"}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveExperience(experience.id, 'up')}
                        className="text-white/60 hover:text-white"
                      >
                        ↑
                      </Button>
                    )}
                    {index < (profile.experiences?.length || 0) - 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveExperience(experience.id, 'down')}
                        className="text-white/60 hover:text-white"
                      >
                        ↓
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExperience(experience.id)}
                      className="text-white/60 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {experience.description && (
                <p className="text-sm text-white/70">{experience.description}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 p-4 rounded-lg bg-white/5"
          >
            <Input
              placeholder="Entreprise"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Input
              placeholder="Poste"
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Date de début"
                value={newExperience.start_date}
                onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              {!isCurrentJob && (
                <Input
                  type="date"
                  placeholder="Date de fin"
                  value={newExperience.end_date}
                  onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="currentJob"
                checked={isCurrentJob}
                onCheckedChange={(checked) => setIsCurrentJob(checked as boolean)}
              />
              <label
                htmlFor="currentJob"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
              >
                Emploi actuel
              </label>
            </div>
            <Textarea
              placeholder="Description"
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              onClick={handleAddExperience}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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