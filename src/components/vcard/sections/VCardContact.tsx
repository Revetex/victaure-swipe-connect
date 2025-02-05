import { UserProfile } from "@/types/profile";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        {isEditing ? (
          <Input
            value={profile.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Votre email"
            className="flex-1"
          />
        ) : (
          <span>{profile.email}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-muted-foreground" />
        {isEditing ? (
          <Input
            value={profile.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Votre téléphone"
            className="flex-1"
          />
        ) : (
          <span>{profile.phone}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <Input
              value={profile.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Ville"
            />
            <Input
              value={profile.state || ''}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Province"
            />
            <Input
              value={profile.country || ''}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Pays"
            />
          </div>
        ) : (
          <span>
            {[profile.city, profile.state, profile.country]
              .filter(Boolean)
              .join(', ')}
          </span>
        )}
      </div>

      {(isEditing || profile.website) && (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          {isEditing ? (
            <Input
              value={profile.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="Votre site web"
              className="flex-1"
            />
          ) : (
            <a
              href={profile.website || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {profile.website}
            </a>
          )}
        </div>
      )}
    </div>
  );
}