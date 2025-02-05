import { UserProfile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ProfilePreviewSkillsProps {
  profile: UserProfile;
}

export function ProfilePreviewSkills({ profile }: ProfilePreviewSkillsProps) {
  if (!profile.skills?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-2"
    >
      <h3 className="text-sm font-medium">Compétences</h3>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill, index) => (
          <Badge key={index} variant="secondary">
            {skill}
          </Badge>
        ))}
      </div>
    </motion.div>
  );
}