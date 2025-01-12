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
          className="w-full p-2 rounded border min-h-[100px]"
        />
      ) : (
        <p>{profile.bio}</p>
      )}
    </div>
  );
}
