import { UserProfile } from "@/types/profile";

interface VCardEducationProps {
  profile: UserProfile;
}

export function VCardEducation({ profile }: VCardEducationProps) {
  if (!profile.education || profile.education.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary/80">Formation</h3>
      <ul className="space-y-2">
        {profile.education.map(edu => (
          <li key={edu.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="font-medium text-foreground">{edu.degree}</div>
            <div className="text-sm text-muted-foreground">{edu.school_name}</div>
            {edu.start_date && (
              <div className="text-xs text-muted-foreground">
                {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}