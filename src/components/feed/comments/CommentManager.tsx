
import { useState } from "react";
import { Comment } from "@/types/posts";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Send, UserCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";

interface CommentManagerProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  comments: Comment[];
  onCommentAdded?: () => void;
}

export function CommentManager({
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  comments,
  onCommentAdded
}: CommentManagerProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Logique d'ajout de commentaire ici
      setNewComment("");
      onCommentAdded?.();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <ScrollArea className="h-full max-h-[300px] pr-4">
        <AnimatePresence mode="popLayout">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3 mb-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {comment.profiles.avatar_url ? (
                  <img
                    src={comment.profiles.avatar_url}
                    alt={comment.profiles.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle className="w-5 h-5 text-white/50" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <ProfileNameButton
                    profile={comment.profiles}
                    className="font-medium text-sm text-white/90 hover:text-white transition-colors duration-200"
                  />
                  <span className="text-xs text-white/40">
                    {format(new Date(comment.created_at), "d MMM 'à' HH:mm", { locale: fr })}
                  </span>
                </div>
                <p className="text-sm text-white/80 break-words">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>

      {currentUserId && (
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            <UserCircle className="w-5 h-5 text-white/50" />
          </div>
          <div className="flex-1 min-w-0">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrivez un commentaire..."
              className="min-h-[42px] max-h-[120px] resize-none bg-white/5 border-white/10 text-white placeholder:text-white/40"
              maxLength={500}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!newComment.trim() || isSubmitting}
            className="bg-[#64B5D9] hover:bg-[#64B5D9]/80 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
