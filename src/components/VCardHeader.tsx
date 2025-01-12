import { UserProfile } from "@/types/profile";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface VCardHeaderProps {
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
      className="flex items-center gap-4 p-4 rounded-lg border bg-card"
      style={{
        fontFamily: customStyles?.font,
        backgroundColor: customStyles?.background,
        color: customStyles?.textColor,
      }}
    >
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
        <AvatarFallback>{profile.full_name?.charAt(0) || "?"}</AvatarFallback>
      </Avatar>
      
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{profile.full_name}</h1>
        <p className="text-muted-foreground">{profile.email}</p>
        {isEditing && (
          <Button
            onClick={() => setProfile({ ...profile, full_name: "" })}
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 mt-2"
          >
            Modifier
          </Button>
        )}
      </div>
    </div>
  );
}