
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCircle, Globe2, Users2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardHeaderProps {
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  privacy_level: "public" | "connections";
  isOwnPost: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function PostCardHeader({
  profile,
  created_at,
  privacy_level,
  isOwnPost,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete
}: PostCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle className="w-6 h-6 text-white/50" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <ProfileNameButton
            profile={profile}
            className="font-semibold text-[#F2EBE4] hover:text-white/90 transition-colors duration-200"
          />
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>
              {format(new Date(created_at), "d MMM 'à' HH:mm", { locale: fr })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {privacy_level === "public" ? (
                <Globe2 className="w-3.5 h-3.5" />
              ) : (
                <Users2 className="w-3.5 h-3.5" />
              )}
              {privacy_level === "public" ? "Public" : "Connexions"}
            </span>
          </div>
        </div>
      </div>

      {isOwnPost && !isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {isEditing && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Annuler
          </Button>
          <Button
            onClick={onSave}
            size="sm"
            className="bg-[#64B5D9] hover:bg-[#64B5D9]/80 text-white"
          >
            Enregistrer
          </Button>
        </div>
      )}
    </div>
  );
}
