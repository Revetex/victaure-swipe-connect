import { VCardSection } from "./VCardSection";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, GraduationCap, Building2, Calendar, GripVertical } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { toast } from "sonner";
import { useVCardStyle } from "./vcard/VCardStyleContext";

interface Education {
  id: string;
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
  const { selectedStyle } = useVCardStyle();

  const handleAddEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...(profile.education || []),
        { id: crypto.randomUUID(), school_name: "", degree: "", field_of_study: "", start_date: "", end_date: "" },
      ],
    });
    toast.success("Formation ajoutée");
  };

  const handleRemoveEducation = (educationId: string) => {
    const newEducation = [...(profile.education || [])].filter(edu => edu.id !== educationId);
    setProfile({ ...profile, education: newEducation });
    toast.success("Formation supprimée");
  };

  const handleReorder = (newOrder: Education[]) => {
    setProfile({ ...profile, education: newOrder });
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
      title="Formation"
      icon={<GraduationCap className="h-4 w-4" style={{ color: selectedStyle.colors.primary }} />}
    >
      <div className="space-y-6 max-w-3xl mx-auto">
        {isEditing ? (
          <Reorder.Group axis="y" values={profile.education || []} onReorder={handleReorder}>
            {(profile.education || []).map((edu: Education) => (
              <Reorder.Item key={edu.id} value={edu}>
                <motion.div 
                  className="relative bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-indigo-500/20"
                >
                  <div className="absolute top-4 left-2 cursor-move">
                    <GripVertical className="h-4 w-4" style={{ color: selectedStyle.colors.primary }} />
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                      <Input
                        value={edu.school_name}
                        onChange={(e) => {
                          const newEducation = [...(profile.education || [])];
                          const eduIndex = newEducation.findIndex(e => e.id === edu.id);
                          newEducation[eduIndex] = { ...edu, school_name: e.target.value };
                          setProfile({ ...profile, education: newEducation });
                        }}
                        placeholder="Nom de l'école"
                        className="flex-1 bg-white/10 border-indigo-500/20"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <GraduationCap className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                      <Input
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...(profile.education || [])];
                          const eduIndex = newEducation.findIndex(e => e.id === edu.id);
                          newEducation[eduIndex] = { ...edu, degree: e.target.value };
                          setProfile({ ...profile, education: newEducation });
                        }}
                        placeholder="Diplôme"
                        className="flex-1 bg-white/10 border-indigo-500/20"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        value={edu.field_of_study}
                        onChange={(e) => {
                          const newEducation = [...(profile.education || [])];
                          const eduIndex = newEducation.findIndex(e => e.id === edu.id);
                          newEducation[eduIndex] = { ...edu, field_of_study: e.target.value };
                          setProfile({ ...profile, education: newEducation });
                        }}
                        placeholder="Domaine d'études"
                        className="flex-1 bg-white/10 border-indigo-500/20"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                        <Input
                          type="date"
                          value={edu.start_date}
                          onChange={(e) => {
                            const newEducation = [...(profile.education || [])];
                            const eduIndex = newEducation.findIndex(e => e.id === edu.id);
                            newEducation[eduIndex] = { ...edu, start_date: e.target.value };
                            setProfile({ ...profile, education: newEducation });
                          }}
                          className="flex-1 bg-white/10 border-indigo-500/20"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            type="date"
                            value={edu.end_date || ''}
                            onChange={(e) => {
                              const newEducation = [...(profile.education || [])];
                              const eduIndex = newEducation.findIndex(e => e.id === edu.id);
                              newEducation[eduIndex] = { ...edu, end_date: e.target.value };
                              setProfile({ ...profile, education: newEducation });
                            }}
                            disabled={!edu.end_date}
                            className="flex-1 bg-white/10 border-indigo-500/20"
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={!edu.end_date}
                              onChange={(e) => {
                                const newEducation = [...(profile.education || [])];
                                const eduIndex = newEducation.findIndex(e => e.id === edu.id);
                                newEducation[eduIndex] = { 
                                  ...edu, 
                                  end_date: e.target.checked ? null : new Date().toISOString().split('T')[0]
                                };
                                setProfile({ ...profile, education: newEducation });
                              }}
                              className="rounded border-gray-300"
                            />
                            <span style={{ color: selectedStyle.colors.text.muted }}>Actuel</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEducation(edu.id)}
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
          (profile.education || []).map((edu: Education) => (
            <motion.div 
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-4 border border-indigo-500/20"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                <p className="font-medium" style={{ color: selectedStyle.colors.text.primary }}>
                  {edu.school_name || "École non définie"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                <p style={{ color: selectedStyle.colors.text.secondary }}>
                  {edu.degree || "Diplôme non défini"}
                </p>
              </div>
              {edu.field_of_study && (
                <p style={{ color: selectedStyle.colors.text.muted }}>
                  {edu.field_of_study}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 shrink-0" style={{ color: selectedStyle.colors.primary }} />
                <span style={{ color: selectedStyle.colors.text.muted }}>
                  {edu.start_date ? formatDate(edu.start_date) : "?"} 
                  {" - "}
                  {edu.end_date ? formatDate(edu.end_date) : "Présent"}
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
              onClick={handleAddEducation} 
              className="w-full transition-colors duration-200"
              style={{ 
                backgroundColor: selectedStyle.colors.primary,
                color: '#fff'
              }}
            >
              Ajouter une formation
            </Button>
          </motion.div>
        )}
      </div>
    </VCardSection>
  );
}
