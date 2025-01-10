import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VCardSection } from "./VCardSection";
import { GraduationCap, Plus, Trash2, Building2, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UserProfile } from "@/types/profile";
import { toast } from "sonner";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducation({ profile, isEditing, setProfile }: VCardEducationProps) {
  const [newEducation, setNewEducation] = useState({
    school_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    description: ""
  });

  const handleAddEducation = () => {
    if (!newEducation.school_name || !newEducation.degree) {
      toast.error("L'école et le diplôme sont requis");
      return;
    }

    const education = {
      id: crypto.randomUUID(),
      ...newEducation
    };

    setProfile({
      ...profile,
      education: [...(profile.education || []), education]
    });

    setNewEducation({
      school_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: ""
    });

    toast.success("Formation ajoutée avec succès");
  };

  const handleRemoveEducation = (id: string) => {
    setProfile({
      ...profile,
      education: profile.education?.filter(edu => edu.id !== id) || []
    });
    toast.success("Formation supprimée");
  };

  return (
    <VCardSection
      title="Formation"
      icon={<GraduationCap className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {profile.education?.map((education) => (
            <motion.div
              key={education.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary/80" />
                    <h4 className="font-medium text-foreground">{education.school_name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary/80" />
                    <p className="text-foreground/80">{education.degree}</p>
                  </div>
                  {education.field_of_study && (
                    <p className="text-sm text-foreground/60 pl-6">{education.field_of_study}</p>
                  )}
                  {(education.start_date || education.end_date) && (
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {education.start_date ? new Date(education.start_date).getFullYear() : "?"} 
                        {" - "}
                        {education.end_date ? new Date(education.end_date).getFullYear() : "Présent"}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEducation(education.id)}
                    className="text-foreground/60 hover:text-destructive"
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
            className="space-y-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <Input
              placeholder="École"
              value={newEducation.school_name}
              onChange={(e) => setNewEducation({ ...newEducation, school_name: e.target.value })}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-foreground/50"
            />
            <Input
              placeholder="Diplôme"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-foreground/50"
            />
            <Input
              placeholder="Domaine d'études"
              value={newEducation.field_of_study}
              onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })}
              className="bg-white/10 border-white/20 text-foreground placeholder:text-foreground/50"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={newEducation.start_date}
                onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
                className="bg-white/10 border-white/20 text-foreground"
              />
              <Input
                type="date"
                value={newEducation.end_date}
                onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
                className="bg-white/10 border-white/20 text-foreground"
              />
            </div>
            <Button
              onClick={handleAddEducation}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!newEducation.school_name || !newEducation.degree}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une formation
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}