
import { UserCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { Comment } from "@/types/posts";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface PostCommentsProps {
  comments: Comment[];
  currentUserId?: string;
  onDeleteComment: (commentId: string) => void;
}

export function PostComments({ comments, currentUserId, onDeleteComment }: PostCommentsProps) {
  const handleDelete = (commentId: string) => {
    onDeleteComment(commentId);
    toast.success("Commentaire supprimé");
  };

  if (!comments || comments.length === 0) return null;

  return (
    <div className="space-y-3 pl-4 border-l-2 border-muted">
      <AnimatePresence mode="popLayout">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-muted/50 hover:bg-muted/80 rounded-lg p-3 transition-all duration-200"
          >
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
                  className="p-0 h-auto text-sm font-medium hover:underline"
                />
                <span className="text-xs text-muted-foreground ml-2">
                  {format(new Date(comment.created_at), "d MMM 'à' HH:mm", { locale: fr })}
                </span>
              </div>
              {comment.user_id === currentUserId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </div>
            <p className="text-sm text-foreground/90">{comment.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
