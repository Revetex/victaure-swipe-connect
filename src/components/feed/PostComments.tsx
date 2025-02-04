import { UserCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;  // Made optional to match database schema
  };
}

interface PostCommentsProps {
  comments: Comment[];
  currentUserId?: string;
  onDeleteComment: (commentId: string) => void;
}

export const PostComments = ({ comments, currentUserId, onDeleteComment }: PostCommentsProps) => {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="space-y-3 pl-4 border-l-2 border-muted">
      {comments.map((comment) => (
        <div key={comment.id} className="group relative bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {comment.profiles.avatar_url ? (
                <img
                  src={comment.profiles.avatar_url}
                  alt={comment.profiles.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <ProfileNameButton 
                profile={{
                  id: comment.user_id,
                  ...comment.profiles
                }}
                className="p-0 h-auto text-sm hover:underline"
              />
              <span className="text-xs text-muted-foreground ml-2">
                {format(new Date(comment.created_at), "d MMM 'à' HH:mm", { locale: fr })}
              </span>
            </div>
            {comment.user_id === currentUserId && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteComment(comment.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}