import { motion } from "framer-motion";
import { VCardContact } from "@/components/VCardContact";
import { VCardSkills } from "@/components/VCardSkills";

interface VCardExpandedGridProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
  newSkill: string;
  setNewSkill: (skill: string) => void;
}

export function VCardExpandedGrid({ 
  profile, 
  isEditing, 
  setProfile,
  newSkill,
  setNewSkill 
}: VCardExpandedGridProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardContact
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </div>

      <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardSkills
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          handleAddSkill={() => {
            if (newSkill && !profile.skills?.includes(newSkill)) {
              setProfile({
                ...profile,
                skills: [...(profile.skills || []), newSkill],
              });
              setNewSkill("");
            }
          }}
          handleRemoveSkill={(skillToRemove: string) => {
            setProfile({
              ...profile,
              skills: profile.skills?.filter(
                (skill: string) => skill !== skillToRemove
              ),
            });
          }}
        />
      </div>
    </motion.div>
  );
}