import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { VCardHeader } from "./vcard/sections/VCardHeader";
import { VCardContact } from "./vcard/sections/VCardContact";
import { VCardSkills } from "./vcard/sections/VCardSkills";

interface VCardProps {
  profile: UserProfile;
  isPublicView?: boolean;
  onEditStateChange?: (isEditing: boolean) => void;
  onRequestChat?: () => void;
}

export function VCard({ profile, isPublicView = false, onEditStateChange, onRequestChat }: VCardProps) {
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Aucune donnée de profil disponible</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "vcard space-y-8 p-6 rounded-xl bg-background/95 backdrop-blur-sm border border-border/50",
      "shadow-lg hover:shadow-xl transition-all duration-300",
      isPublicView ? 'public' : 'private'
    )}>
      <VCardHeader profile={profile} />
      <VCardContact profile={profile} />
      <VCardSkills profile={profile} />
      
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
                {edu.start_date && (
                  <div className="text-xs text-muted-foreground">
                    {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                  </div>
                )}
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
                  {exp.company} ({exp.start_date ? new Date(exp.start_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : ''} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 'Present'})
                </div>
                {exp.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}