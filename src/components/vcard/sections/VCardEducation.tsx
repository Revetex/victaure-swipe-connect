import { UserProfile } from "@/types/profile";
import { GraduationCap } from "lucide-react";

interface VCardEducationProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEducation({ profile, isEditing, setProfile }: VCardEducationProps) {
  if (!profile.education || profile.education.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Formation</h3>
      </div>

      <div className="space-y-4">
        {profile.education.map((edu) => (
          <div key={edu.id} className="p-4 rounded-lg bg-card">
            <h4 className="font-medium">{edu.degree}</h4>
            <p className="text-sm text-muted-foreground">{edu.school_name}</p>
            {edu.start_date && (
              <p className="text-xs text-muted-foreground">
                {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}