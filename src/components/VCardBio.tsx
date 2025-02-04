import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";
import { VCardBioHeader } from "./vcard/bio/VCardBioHeader";
import { VCardBioContent } from "./vcard/bio/VCardBioContent";
import { generateBio } from "./vcard/bio/VCardBioGenerator";

interface VCardBioProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardBio({ profile, isEditing, setProfile }: VCardBioProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    try {
      const generatedBio = await generateBio(profile);
      setProfile({ ...profile, bio: generatedBio });
      toast.success("Bio générée avec succès");
    } catch (error: any) {
      console.error("Error generating bio:", error);
      toast.error(error.message || "Erreur lors de la génération de la bio");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-4 sm:p-6 rounded-xl bg-white/5 dark:bg-black/20 backdrop-blur-sm border border-gray-200/10 dark:border-white/5"
    >
      <VCardBioHeader 
        isEditing={isEditing}
        isGenerating={isGenerating}
        onGenerateBio={handleGenerateBio}
      />
      <VCardBioContent 
        profile={profile}
        isEditing={isEditing}
        setProfile={setProfile}
      />
    </motion.div>
  );
}