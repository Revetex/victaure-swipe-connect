import { UserProfile } from "@/types/profile";
import { VCardBadge } from "@/components/VCardBadge";

interface VCardSkillsProps {
  profile: UserProfile;
}

export function VCardSkills({ profile }: VCardSkillsProps) {
  if (!profile.skills || profile.skills.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary/80">Compétences</h3>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill, index) => (
          <VCardBadge key={index} text={skill} />
        ))}
      </div>
    </div>
  );
}