import { Mail, Phone, MapPin } from "lucide-react";
import { UserProfile } from "@/types/profile";
import { useVCardStyle } from "./vcard/VCardStyleContext";
import { VCardSection } from "./VCardSection";

interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardContact({ profile, isEditing, setProfile }: VCardContactProps) {
  const { selectedStyle } = useVCardStyle();

  return (
    <VCardSection 
      title="Contact"
      icon={<Mail className="h-5 w-5" />}
    >
      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Votre email"
                className="flex-1 bg-background/50 border rounded-md p-2"
                style={{ 
                  color: selectedStyle.colors.text.primary,
                  borderColor: `${selectedStyle.colors.primary}30`,
                  backgroundColor: `${selectedStyle.colors.primary}05`,
                  fontFamily: selectedStyle.font
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Votre téléphone"
                className="flex-1 bg-background/50 border rounded-md p-2"
                style={{ 
                  color: selectedStyle.colors.text.primary,
                  borderColor: `${selectedStyle.colors.primary}30`,
                  backgroundColor: `${selectedStyle.colors.primary}05`,
                  fontFamily: selectedStyle.font
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={profile.city || ""}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="Ville"
                className="flex-1 bg-background/50 border rounded-md p-2"
                style={{ 
                  color: selectedStyle.colors.text.primary,
                  borderColor: `${selectedStyle.colors.primary}30`,
                  backgroundColor: `${selectedStyle.colors.primary}05`,
                  fontFamily: selectedStyle.font
                }}
              />
              <input
                type="text"
                value={profile.state || ""}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                placeholder="Province"
                className="flex-1 bg-background/50 border rounded-md p-2"
                style={{ 
                  color: selectedStyle.colors.text.primary,
                  borderColor: `${selectedStyle.colors.primary}30`,
                  backgroundColor: `${selectedStyle.colors.primary}05`,
                  fontFamily: selectedStyle.font
                }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3" style={{ fontFamily: selectedStyle.font }}>
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`} 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ color: selectedStyle.colors.text.primary }}
              >
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </a>
            )}
            {profile.phone && (
              <a 
                href={`tel:${profile.phone}`} 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                style={{ color: selectedStyle.colors.text.primary }}
              >
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </a>
            )}
            {(profile.city || profile.state) && (
              <div 
                className="flex items-center gap-2"
                style={{ color: selectedStyle.colors.text.primary }}
              >
                <MapPin className="h-4 w-4" />
                <span>{[profile.city, profile.state].filter(Boolean).join(", ")}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </VCardSection>
  );
}