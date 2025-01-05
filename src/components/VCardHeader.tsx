import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Profile } from "@/types/profile";
import { UserCircle } from "lucide-react";

interface VCardHeaderProps {
  profile: Profile;
  isEditing: boolean;
  setProfile: (profile: Profile) => void;
}

export function VCardHeader({ profile, isEditing, setProfile }: VCardHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
        <AvatarFallback>
          <UserCircle className="w-8 h-8" />
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-1">
        {isEditing ? (
          <Input
            value={profile.full_name || ""}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            placeholder="Votre nom complet"
            className="max-w-[200px]"
          />
        ) : (
          <h2 className="text-2xl font-bold">{profile.full_name}</h2>
        )}
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>
    </div>
  );
}