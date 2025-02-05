import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

interface VCardProps {
  profile: UserProfile;
  isPublicView?: boolean;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ profile, isPublicView = false }: VCardProps) {
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  return (
    <div className={cn("vcard", isPublicView ? 'public' : 'private')}>
      <h2>{profile.full_name || 'Unnamed Profile'}</h2>
      <img 
        src={profile.avatar_url || '/default-avatar.png'} 
        alt={profile.full_name || 'Profile'} 
        className="w-24 h-24 rounded-full"
      />
      {profile.bio && <p>{profile.bio}</p>}
      {profile.email && <p>{profile.email}</p>}
      {profile.phone && <p>{profile.phone}</p>}
      {(profile.city || profile.state || profile.country) && (
        <p>
          {[profile.city, profile.state, profile.country]
            .filter(Boolean)
            .join(", ")}
        </p>
      )}
      
      {profile.certifications && profile.certifications.length > 0 && (
        <div>
          <h3>Certifications</h3>
          <ul>
            {profile.certifications.map(cert => (
              <li key={cert.id}>
                {cert.title} - {cert.institution} ({cert.year})
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.education && profile.education.length > 0 && (
        <div>
          <h3>Education</h3>
          <ul>
            {profile.education.map(edu => (
              <li key={edu.id}>
                {edu.degree} from {edu.school_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.experiences && profile.experiences.length > 0 && (
        <div>
          <h3>Experience</h3>
          <ul>
            {profile.experiences.map(exp => (
              <li key={exp.id}>
                {exp.position} at {exp.company} ({exp.start_date} - {exp.end_date || 'Present'})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}