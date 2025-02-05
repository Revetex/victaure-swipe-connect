import { UserProfile } from "@/types/profile";

interface VCardExperienceProps {
  profile: UserProfile;
}

export function VCardExperience({ profile }: VCardExperienceProps) {
  if (!profile.experiences || profile.experiences.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary/80">Expérience</h3>
      <ul className="space-y-2">
        {profile.experiences.map(exp => (
          <li key={exp.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
            <div className="font-medium text-foreground">{exp.position}</div>
            <div className="text-sm text-muted-foreground">
              {exp.company} ({exp.start_date ? new Date(exp.start_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : ''} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 'Present'})
            </div>
            {exp.description && (
              <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}