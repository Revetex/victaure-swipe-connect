import { VCardSection } from "./VCardSection";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Calendar, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/profile";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducation({
  profile,
  isEditing,
  setProfile,
}: VCardEducationProps) {
  const handleAddEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...(profile.education || []),
        { 
          id: crypto.randomUUID(), 
          school_name: "", 
          degree: "", 
          field_of_study: "", 
          start_date: "", 
          end_date: "" 
        },
      ],
    });
    toast.success("Formation ajoutée");
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...(profile.education || [])];
    newEducation.splice(index, 1);
    setProfile({ ...profile, education: newEducation });
    toast.success("Formation supprimée");
  };

  return (
    <VCardSection 
      title="Formation"
      icon={<GraduationCap className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {profile.education?.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative p-4 rounded-lg bg-card/40 dark:bg-card/30 backdrop-blur-sm border border-border/50 dark:border-border/30 space-y-3"
            >
              {isEditing ? (
                <>
                  <div className="space-y-3">
                    <Input
                      value={edu.school_name}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        newEducation[index] = { ...edu, school_name: e.target.value };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="Nom de l'établissement"
                      className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                    />
                    <Input
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        newEducation[index] = { ...edu, degree: e.target.value };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="Diplôme"
                      className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                    />
                    <Input
                      value={edu.field_of_study || ""}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        newEducation[index] = { ...edu, field_of_study: e.target.value };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="Domaine d'études"
                      className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={edu.start_date || ""}
                        onChange={(e) => {
                          const newEducation = [...(profile.education || [])];
                          newEducation[index] = { ...edu, start_date: e.target.value };
                          setProfile({ ...profile, education: newEducation });
                        }}
                        className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                      />
                      <Input
                        type="date"
                        value={edu.end_date || ""}
                        onChange={(e) => {
                          const newEducation = [...(profile.education || [])];
                          newEducation[index] = { ...edu, end_date: e.target.value };
                          setProfile({ ...profile, education: newEducation });
                        }}
                        className="bg-background/50 dark:bg-background/30 border-border/50 dark:border-border/30"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEducation(index)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary/80" />
                    <h4 className="font-medium text-foreground/90">{edu.school_name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                  {edu.field_of_study && (
                    <p className="text-sm text-muted-foreground">{edu.field_of_study}</p>
                  )}
                  {(edu.start_date || edu.end_date) && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {edu.start_date && new Date(edu.start_date).getFullYear()}
                        {edu.end_date && ` - ${new Date(edu.end_date).getFullYear()}`}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={handleAddEducation} 
              variant="outline" 
              className="w-full mt-4 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
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