import { UserProfile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

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

export function VCardHeader({ profile, customStyles }: VCardHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center text-center p-6 rounded-lg border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "md:flex-row md:text-left md:items-start md:gap-6"
      )}
      style={{
        fontFamily: customStyles?.font,
        backgroundColor: customStyles?.background,
        color: customStyles?.textColor,
      }}
    >
      <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
        <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
        <AvatarFallback>{profile.full_name?.charAt(0) || "?"}</AvatarFallback>
      </Avatar>
      
      <div className="mt-4 md:mt-0 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {profile.full_name || "Sans nom"}
        </h1>
        {profile.role && (
          <p className="text-lg text-muted-foreground">
            {profile.role}
          </p>
        )}
      </div>
    </div>
  );
}