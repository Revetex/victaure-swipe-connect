import { motion } from "framer-motion";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardCertifications } from "@/components/VCardCertifications";
import { toast } from "sonner";
import { useEffect } from "react";

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

  useEffect(() => {
    // If there's an error loading education data, show a toast
    if (profile?.education === undefined) {
      console.error("Failed to load education data");
      toast.error("Impossible de charger les données d'éducation");
    }
  }, [profile?.education]);

  return (
    <>
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardEducation
          profile={{
            ...profile,
            education: profile?.education || [] // Provide fallback empty array
          }}
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