import { UserProfile } from "@/types/profile";

interface VCardCertificationsProps {
  profile: UserProfile;
}

export function VCardCertifications({ profile }: VCardCertificationsProps) {
  if (!profile.certifications || profile.certifications.length === 0) return null;

  return (
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
  );
}