
import { UserCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
interface PostHeaderProps {
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  privacy_level: "public" | "connections";
}
export function PostHeader({
  profile,
  created_at,
  privacy_level
}: PostHeaderProps) {
  return <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[#1A1F2C]/80 border-b border-[#9b87f5]/10">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#9b87f5]/10 flex items-center justify-center overflow-hidden shrink-0 border border-[#9b87f5]/20">
        {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" /> : <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#9b87f5]/60" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <ProfileNameButton profile={profile} className="font-medium hover:text-[#9b87f5] hover:underline p-0 h-auto text-sm sm:text-base" />
        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
          <span>
            {format(new Date(created_at), "d MMM 'à' HH:mm", {
            locale: fr
          })}
          </span>
          <span>•</span>
          <span className="capitalize">{privacy_level === "public" ? "Public" : "Connexions"}</span>
        </div>
      </div>
    </div>;
}
