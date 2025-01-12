import { UserProfile } from "@/types/profile";
import { cn } from "@/lib/utils";

export interface VCardBioProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardBio({ profile, isEditing, setProfile, customStyles }: VCardBioProps) {
  const handleBioChange = (value: string) => {
    setProfile({ ...profile, bio: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Présentation</h2>
      <div
        className={cn(
          "p-6 rounded-lg border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "transition-all duration-200"
        )}
        style={{
          fontFamily: customStyles?.font,
          backgroundColor: customStyles?.background,
          color: customStyles?.textColor,
        }}
      >
        {isEditing ? (
          <textarea
            value={profile.bio || ""}
            onChange={(e) => handleBioChange(e.target.value)}
            placeholder="Votre bio"
            className={cn(
              "w-full p-4 rounded-md border min-h-[150px] bg-background/50",
              "focus:ring-2 focus:ring-primary/50 focus:outline-none"
            )}
            style={{
              fontFamily: customStyles?.font,
              color: customStyles?.textColor,
            }}
          />
        ) : (
          <div 
            className="prose prose-sm max-w-none"
            style={{
              fontFamily: customStyles?.font,
              color: customStyles?.textColor,
            }}
          >
            <p className="whitespace-pre-wrap leading-relaxed">
              {profile.bio || "Aucune présentation disponible"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}