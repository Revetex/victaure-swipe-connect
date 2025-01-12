import { UserProfile } from "@/types/profile";

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
        className="p-4 rounded-lg border bg-card"
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
            className="w-full p-2 rounded border min-h-[100px] bg-background"
            style={{
              fontFamily: customStyles?.font,
              color: customStyles?.textColor,
            }}
          />
        ) : (
          <p 
            className="whitespace-pre-wrap"
            style={{
              fontFamily: customStyles?.font,
              color: customStyles?.textColor,
            }}
          >
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
}