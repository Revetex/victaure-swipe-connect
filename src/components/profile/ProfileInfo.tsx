import { UserProfile } from "@/types/profile";
import { Briefcase, MapPin, Mail, Globe, Building2 } from "lucide-react";

interface ProfileInfoProps {
  profile: UserProfile;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  const renderInfoItem = (icon: JSX.Element, value?: string | null, label?: string) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">
          {label ? `${label}: ${value}` : value}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight">
          {profile.full_name || "Utilisateur"}
        </h3>
        {renderInfoItem(<Briefcase className="h-4 w-4" />, profile.role)}
      </div>

      <div className="w-full space-y-2">
        {renderInfoItem(
          <MapPin className="h-4 w-4" />,
          [profile.city, profile.state, profile.country].filter(Boolean).join(", ")
        )}
        {renderInfoItem(<Mail className="h-4 w-4" />, profile.email)}
        {renderInfoItem(<Globe className="h-4 w-4" />, profile.website)}
        {renderInfoItem(<Building2 className="h-4 w-4" />, profile.company_name)}
      </div>
    </>
  );
}