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
    <div className={cn(
      "vcard space-y-8 p-6 rounded-xl bg-background/95 backdrop-blur-sm border border-border/50",
      "shadow-lg hover:shadow-xl transition-all duration-300",
      isPublicView ? 'public' : 'private'
    )}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary tracking-tight">
          {profile.full_name || 'Unnamed Profile'}
        </h2>
        
        <div className="flex items-center gap-4">
          <img 
            src={profile.avatar_url || '/default-avatar.png'} 
            alt={profile.full_name || 'Profile'} 
            className="w-24 h-24 rounded-full ring-2 ring-primary/20 shadow-md"
          />
          {profile.bio && (
            <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {profile.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Email:</span>
            {profile.email}
          </div>
        )}
        
        {profile.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Téléphone:</span>
            {profile.phone}
          </div>
        )}
        
        {(profile.city || profile.state || profile.country) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Localisation:</span>
            {[profile.city, profile.state, profile.country]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}
      </div>
      
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary/80">Certifications</h3>
          <ul className="space-y-2">
            {profile.certifications.map(cert => (
              <li key={cert.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="font-medium text-foreground">{cert.title}</div>
                <div className="text-sm text-muted-foreground">
                  {cert.institution} ({cert.year})
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.education && profile.education.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary/80">Formation</h3>
          <ul className="space-y-2">
            {profile.education.map(edu => (
              <li key={edu.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="font-medium text-foreground">{edu.degree}</div>
                <div className="text-sm text-muted-foreground">{edu.school_name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.experiences && profile.experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary/80">Expérience</h3>
          <ul className="space-y-2">
            {profile.experiences.map(exp => (
              <li key={exp.id} className="p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="font-medium text-foreground">{exp.position}</div>
                <div className="text-sm text-muted-foreground">
                  {exp.company} ({exp.start_date} - {exp.end_date || 'Present'})
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}