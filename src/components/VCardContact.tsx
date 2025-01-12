import { UserProfile } from "@/types/profile";
import { Input } from "./ui/input";
import { Phone, MapPin, Globe } from "lucide-react";

export interface VCardContactProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardContact({ profile, isEditing, setProfile, customStyles }: VCardContactProps) {
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div 
      className="space-y-4"
      style={{ 
        fontFamily: customStyles?.font,
        color: customStyles?.textColor,
      }}
    >
      <h2 className="text-lg font-semibold">Contact</h2>
      <div 
        className="grid gap-4 p-4 rounded-lg border bg-card"
        style={{
          backgroundColor: customStyles?.background,
        }}
      >
        {isEditing ? (
          <>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Téléphone"
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div className="grid grid-cols-3 gap-2 flex-1">
                <Input
                  type="text"
                  value={profile.city || ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Ville"
                />
                <Input
                  type="text"
                  value={profile.state || ""}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="Province"
                />
                <Input
                  type="text"
                  value={profile.country || ""}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Pays"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={profile.website || ""}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="Site web"
                className="flex-1"
              />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {profile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
            )}
            {(profile.city || profile.state || profile.country) && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>
                  {[profile.city, profile.state, profile.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <a 
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}