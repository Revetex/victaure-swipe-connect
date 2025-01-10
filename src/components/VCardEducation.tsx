import { VCardSection } from "./VCardSection";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Education } from "@/types/profile";
import { EducationList } from "./vcard/education/EducationList";

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

  const handleUpdateEducation = (index: number, updatedEducation: Education) => {
    const newEducation = [...(profile.education || [])];
    newEducation[index] = updatedEducation;
    setProfile({ ...profile, education: newEducation });
  };

  const handleReorder = (newOrder: Education[]) => {
    setProfile({ ...profile, education: newOrder });
  };

  return (
    <VCardSection 
      title="Formation"
      icon={<GraduationCap className="h-4 w-4 text-indigo-400" />}
    >
      <div className="space-y-6">
        <EducationList
          education={profile.education || []}
          isEditing={isEditing}
          onReorder={handleReorder}
          onUpdate={handleUpdateEducation}
          onRemove={handleRemoveEducation}
        />
        
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