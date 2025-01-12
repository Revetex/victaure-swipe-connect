import { UserProfile } from "@/types/profile";

export interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
  customStyles?: {
    font?: string;
    background?: string;
    textColor?: string;
  };
}

export function VCardHeader({ profile, isEditing, setProfile, customStyles }: VCardHeaderProps) {
  return (
    <div
      style={{
        fontFamily: customStyles?.font,
        backgroundColor: customStyles?.background,
        color: customStyles?.textColor,
      }}
    >
      <h1 className="text-2xl font-bold">{profile.full_name}</h1>
      <p className="text-muted-foreground">{profile.email}</p>
      {isEditing && (
        <button 
          onClick={() => setProfile({ ...profile, full_name: "" })}
          className="mt-2 text-sm text-destructive hover:text-destructive/80"
        >
          Modifier
        </button>
      )}
    </div>
  );
}