import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, GraduationCap, Building2, Calendar } from "lucide-react";
import { VCardSection } from "./VCardSection";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Education {
  school_name: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

interface VCardEducationProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
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
        { school_name: "", degree: "", field_of_study: "", start_date: "", end_date: "" },
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
      icon={<GraduationCap className="h-4 w-4 text-indigo-400" />}
    >
      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {(profile.education || []).map((edu: Education, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-white/5 backdrop-blur-sm rounded-lg p-4 space-y-4 border border-indigo-500/20 hover:border-indigo-500/30 transition-colors"
            >
              {isEditing ? (
                <>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <Input
                      value={edu.school_name}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        newEducation[index].school_name = e.target.value;
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="Nom de l'école"
                      className="flex-1 bg-white/10 border-indigo-500/20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
                    <Input
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        newEducation[index].degree = e.target.value;
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="Diplôme"
                      className="flex-1 bg-white/10 border-indigo-500/20"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={edu.field_of_study}
                      onChange={(e) => {
                        const newEducation = [...(profile.education || [])];
                        newEducation[index].field_of_study = e.target.value;
                        setProfile({ ...profile, education: newEducation });
                      }}
                      placeholder="Domaine d'études"
                      className="flex-1 bg-white/10 border-indigo-500/20"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                      <Input
                        type="date"
                        value={edu.start_date}
                        onChange={(e) => {
                          const newEducation = [...(profile.education || [])];
                          newEducation[index].start_date = e.target.value;
                          setProfile({ ...profile, education: newEducation });
                        }}
                        className="flex-1 bg-white/10 border-indigo-500/20"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                      <Input
                        type="date"
                        value={edu.end_date}
                        onChange={(e) => {
                          const newEducation = [...(profile.education || [])];
                          newEducation[index].end_date = e.target.value;
                          setProfile({ ...profile, education: newEducation });
                        }}
                        className="flex-1 bg-white/10 border-indigo-500/20"
                      />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEducation(index)}
                      className="text-indigo-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    <p className="font-medium text-white">{edu.school_name || "École non définie"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
                    <p className="text-white/80">{edu.degree || "Diplôme non défini"}</p>
                  </div>
                  {edu.field_of_study && (
                    <p className="text-white/70 pl-6">{edu.field_of_study}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {edu.start_date ? new Date(edu.start_date).getFullYear() : "?"} 
                      {" - "}
                      {edu.end_date ? new Date(edu.end_date).getFullYear() : "Présent"}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
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
      </AnimatePresence>
    </VCardSection>
  );
}