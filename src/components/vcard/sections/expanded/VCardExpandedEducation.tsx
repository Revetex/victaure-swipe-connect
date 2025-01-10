import { motion } from "framer-motion";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardCertifications } from "@/components/VCardCertifications";

interface VCardExpandedEducationProps {
  profile: any;
  isEditing: boolean;
  setProfile: (profile: any) => void;
}

export function VCardExpandedEducation({ profile, isEditing, setProfile }: VCardExpandedEducationProps) {
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
    <>
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardEducation
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardCertifications
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </motion.div>
    </>
  );
}
