import { UserCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Globe, Lock } from "lucide-react";

interface PostHeaderProps {
  profile: {
    full_name: string;
    avatar_url: string;
  };
  created_at: string;
  privacy_level: "public" | "connections";
}

export const PostHeader = ({ profile, created_at, privacy_level }: PostHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <UserCircle className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{profile.full_name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{format(new Date(created_at), "d MMMM 'à' HH:mm", { locale: fr })}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            {privacy_level === "public" ? (
              <>
                <Globe className="h-3 w-3" />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                <span>Connexions</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};