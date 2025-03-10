
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/profile";
import { StyleOption } from "../types";
import { VCardSections } from "../VCardSections";
import { useThemeContext } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VCardSectionsManagerProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  selectedStyle: StyleOption;
}

export function VCardSectionsManager({
  profile,
  isEditing,
  setProfile,
  selectedStyle,
}: VCardSectionsManagerProps) {
  const [sectionsOrder, setSectionsOrder] = useState<string[]>([]);
  const { themeStyle, isDark } = useThemeContext();

  useEffect(() => {
    if (profile?.sections_order) {
      // Ensure sections are unique
      const uniqueSections = Array.from(new Set(profile.sections_order));
      if (uniqueSections.length !== profile.sections_order.length) {
        setProfile({
          ...profile,
          sections_order: uniqueSections
        });
      }
      setSectionsOrder(uniqueSections);
    } else {
      // Make sure we include education and experience sections
      setSectionsOrder(['header', 'bio', 'contact', 'skills', 'education', 'experience']);
    }
  }, [profile, setProfile]);

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    const updatedSkills = (profile.skills || []).filter(
      (skill) => skill !== skillToRemove
    );
    setProfile({ ...profile, skills: updatedSkills });
  };

  // Ensure education and experiences arrays exist
  const profileWithArrays = {
    ...profile,
    education: profile.education || [],
    experiences: profile.experiences || [],
  };

  return (
    <motion.div 
      className={cn(
        `theme-${themeStyle}`,
        "transition-colors duration-300",
        isDark ? "text-white/90" : "text-slate-900"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <VCardSections
        profile={profileWithArrays}
        isEditing={isEditing}
        setProfile={setProfile}
        handleRemoveSkill={handleRemoveSkill}
        selectedStyle={selectedStyle}
        sectionsOrder={sectionsOrder}
      />
    </motion.div>
  );
}
