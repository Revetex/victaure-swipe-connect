import { UserProfile } from "@/types/profile";
import { Award } from "lucide-react";

interface VCardCertificationsProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCertifications({ profile, isEditing, setProfile }: VCardCertificationsProps) {
  if (!profile.certifications || profile.certifications.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Certifications</h3>
      </div>

      <div className="space-y-4">
        {profile.certifications.map((cert) => (
          <div key={cert.id} className="p-4 rounded-lg bg-card">
            <h4 className="font-medium">{cert.title}</h4>
            <p className="text-sm text-muted-foreground">
              {cert.institution} ({cert.year})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}