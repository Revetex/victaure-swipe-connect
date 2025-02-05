import { UserProfile } from "@/types/profile";
import { Briefcase } from "lucide-react";

interface VCardExperienceProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardExperience({ profile, isEditing, setProfile }: VCardExperienceProps) {
  if (!profile.experiences || profile.experiences.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Expérience</h3>
      </div>

      <div className="space-y-4">
        {profile.experiences.map((exp) => (
          <div key={exp.id} className="p-4 rounded-lg bg-card">
            <h4 className="font-medium">{exp.position}</h4>
            <p className="text-sm text-muted-foreground">{exp.company}</p>
            {exp.start_date && (
              <p className="text-xs text-muted-foreground">
                {new Date(exp.start_date).toLocaleDateString('fr-FR', { 
                  year: 'numeric',
                  month: 'long'
                })} - {
                  exp.end_date 
                    ? new Date(exp.end_date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long'
                      })
                    : 'Present'
                }
              </p>
            )}
            {exp.description && (
              <p className="mt-2 text-sm">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}