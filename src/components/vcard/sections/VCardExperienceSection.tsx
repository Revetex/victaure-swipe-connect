
import { UserProfile, Experience } from "@/types/profile";
import { VCardExperiences } from "../VCardExperiences";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

interface VCardExperienceSectionProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperienceSection({
  profile,
  isEditing,
  setProfile,
}: VCardExperienceSectionProps) {
  const handleUpdateExperiences = (experiences: Experience[]) => {
    setProfile({ ...profile, experiences });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Expériences</h2>
      </div>
      
      <VCardExperiences
        experiences={profile.experiences}
        isEditing={isEditing}
        onUpdate={handleUpdateExperiences}
      />
    </motion.div>
  );
}
