import { UserProfile } from "@/types/profile";
import { VCardSection } from "./VCardSection";
import { GraduationCap, Building2, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardEducation({ profile, isEditing, setProfile, customStyles }: VCardEducationProps) {
  const handleAddEducation = () => {
    const newEducation = {
      id: crypto.randomUUID(),
      school_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: ""
    };

    setProfile({
      ...profile,
      education: [...(profile.education || []), newEducation],
    });
    toast.success("Formation ajoutée");
  };

  const handleRemoveEducation = (id: string) => {
    setProfile({
      ...profile,
      education: (profile.education || []).filter((edu) => edu.id !== id),
    });
    toast.success("Formation supprimée");
  };

  return (
    <VCardSection 
      title="Formation" 
      icon={<GraduationCap className="h-5 w-5 text-indigo-400" />}
    >
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {(profile.education || []).map((education) => (
            <motion.div
              key={education.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative border-l-2 border-indigo-500/30 pl-4 py-3 space-y-3 hover:bg-white/5 rounded-r transition-colors"
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
                    <Input
                      value={education.school_name}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        const index = newEducation.findIndex(edu => edu.id === education.id);
                        newEducation[index] = { ...education, school_name: e.target.value };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="Nom de l'école"
                      className="flex-1 bg-white/10 border-indigo-500/20"
                    />
                  </div>
                  <Input
                    value={education.degree}
                    onChange={(e) => {
                      const newEducation = [...(profile.education || [])];
                      const index = newEducation.findIndex(edu => edu.id === education.id);
                      newEducation[index] = { ...education, degree: e.target.value };
                      setProfile({ ...profile, education: newEducation });
                    }}
                    placeholder="Diplôme"
                    className="w-full bg-white/10 border-indigo-500/20"
                  />
                  <Input
                    value={education.field_of_study || ""}
                    onChange={(e) => {
                      const newEducation = [...(profile.education || [])];
                      const index = newEducation.findIndex(edu => edu.id === education.id);
                      newEducation[index] = { ...education, field_of_study: e.target.value };
                      setProfile({ ...profile, education: newEducation });
                    }}
                    placeholder="Domaine d'études"
                    className="w-full bg-white/10 border-indigo-500/20"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={education.start_date || ""}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        const index = newEducation.findIndex(edu => edu.id === education.id);
                        newEducation[index] = { ...education, start_date: e.target.value };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      className="bg-white/10 border-indigo-500/20"
                    />
                    <Input
                      type="date"
                      value={education.end_date || ""}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        const index = newEducation.findIndex(edu => edu.id === education.id);
                        newEducation[index] = { ...education, end_date: e.target.value };
                        setProfile({ ...profile, education: newEducation });
                      }}
                      className="bg-white/10 border-indigo-500/20"
                    />
                  </div>
                  <Textarea
                    value={education.description || ""}
                    onChange={(e) => {
                      const newEducation = [...(profile.education || [])];
                      const index = newEducation.findIndex(edu => edu.id === education.id);
                      newEducation[index] = { ...education, description: e.target.value };
                      setProfile({ ...profile, education: newEducation });
                    }}
                    placeholder="Description"
                    className="w-full bg-white/10 border-indigo-500/20 min-h-[100px]"
                  />
                  <Button
                    onClick={() => handleRemoveEducation(education.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    Supprimer
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-400 shrink-0" />
                    <h4 className="font-medium text-lg text-white">{education.school_name}</h4>
                  </div>
                  <p className="text-white/80">{education.degree}</p>
                  {education.field_of_study && (
                    <p className="text-white/70">{education.field_of_study}</p>
                  )}
                  {(education.start_date || education.end_date) && (
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">
                        {education.start_date && new Date(education.start_date).toLocaleDateString()}
                        {education.end_date ? 
                          ` - ${new Date(education.end_date).toLocaleDateString()}` : 
                          " - Présent"
                        }
                      </p>
                    </div>
                  )}
                  {education.description && (
                    <p className="text-sm text-white/70 mt-2">{education.description}</p>
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
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500"
            >
              Ajouter une formation
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}