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
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Badge 
              variant="secondary"
              className="bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              {skill}
            </Badge>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}