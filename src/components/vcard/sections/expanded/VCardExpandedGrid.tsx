import { motion } from "framer-motion";
import { VCardContact } from "@/components/VCardContact";
import { VCardSkills } from "@/components/VCardSkills";
import { VCardEducation } from "@/components/VCardEducation";
import { VCardCertifications } from "@/components/VCardCertifications";
import { VCardExperiences } from "@/components/VCardExperiences";
import { VCardSection } from "@/components/VCardSection";
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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
  setNewSkill,
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

  const handleAddSkill = () => {
    if (newSkill && !profile.skills?.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills?.filter(
        (skill: string) => skill !== skillToRemove
      ),
    });
  };

  return (
    <div className="grid gap-8 px-6">
      {/* Contact and Skills Section */}
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
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
        </div>
      </motion.div>

      {/* Description Section */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardSection
          title="Description"
          icon={<FileText className="h-4 w-4" />}
        >
          {isEditing ? (
            <Textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Décrivez votre parcours professionnel..."
              className="min-h-[150px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-300">
              {profile.bio || "Aucune description disponible"}
            </p>
          )}
        </VCardSection>
      </motion.div>

      {/* Experiences Section */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardExperiences
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </motion.div>

      {/* Education Section */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardEducation
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </motion.div>

      {/* Certifications Section */}
      <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
        <VCardCertifications
          profile={profile}
          isEditing={isEditing}
          setProfile={setProfile}
        />
      </motion.div>
    </div>
  );
}