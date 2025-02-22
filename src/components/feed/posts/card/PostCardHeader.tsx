
import { UserProfile } from "@/types/profile";
import { UserAvatar } from "@/components/UserAvatar";
import { MoreVertical, Globe, Lock, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PostCardHeaderProps {
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  created_at: string;
  privacy_level: 'public' | 'connections';
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
  const PrivacyIcon = {
    public: Globe,
    connections: Users
  }[privacy_level];

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={profile} />
        <div>
          <h3 className="font-semibold text-[#F2EBE4]">{profile.full_name}</h3>
          <div className="flex items-center gap-2 text-xs text-[#F2EBE4]/70">
            <time>{formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: fr })}</time>
            <span>•</span>
            <div className="flex items-center gap-1">
              <PrivacyIcon className="w-3 h-3" />
              <span className="capitalize">{privacy_level}</span>
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <Button
            onClick={onSave}
            size="sm"
            variant="ghost"
            className="text-[#64B5D9] hover:text-[#64B5D9]/80"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
          <Button
            onClick={onCancel}
            size="sm"
            variant="ghost"
            className="text-[#F2EBE4]/70 hover:text-[#F2EBE4]"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      ) : isOwnPost && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#F2EBE4]/70 hover:text-[#F2EBE4]"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1B2A4A] border-[#64B5D9]/10 text-[#F2EBE4]">
            <DropdownMenuItem onClick={onEdit} className="hover:text-[#64B5D9]">
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
