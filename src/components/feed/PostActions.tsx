import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  isExpanded: boolean;
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  onLike: () => void;
  onDislike: () => void;
  onToggleComments: () => void;
}

export const PostActions = ({
  likes,
  dislikes,
  commentCount,
  userReaction,
  isExpanded,
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  onLike,
  onDislike,
  onToggleComments,
}: PostActionsProps) => {
  const { toast } = useToast();

  const createNotification = async (userId: string, title: string, message: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
        });

      if (error) throw error;

      // Send push notification if the user has enabled them
      const { data: profile } = await supabase
        .from('profiles')
        .select('push_token, push_notifications_enabled')
        .eq('id', userId)
        .single();

      if (profile?.push_notifications_enabled && profile?.push_token) {
        await supabase.functions.invoke('push-notification', {
          body: {
            subscription: JSON.parse(profile.push_token),
            title,
            message
          }
        });
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!currentUserId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour réagir",
        variant: "destructive"
      });
      return;
    }

    if (type === 'like') {
      onLike();
      if (postAuthorId !== currentUserId) {
        await createNotification(
          postAuthorId,
          'Nouveau j\'aime',
          `${userEmail} a aimé votre publication`
        );
      }
    } else {
      onDislike();
      if (postAuthorId !== currentUserId) {
        await createNotification(
          postAuthorId,
          'Nouveau je n\'aime pas',
          `${userEmail} n'a pas aimé votre publication`
        );
      }
    }
  };

  return (
    <div className="flex gap-2 items-center py-2">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={userReaction === 'like' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleReaction('like')}
          className={cn(
            "flex gap-2 items-center",
            userReaction === 'like' && "bg-green-500 hover:bg-green-600 text-white"
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-medium">{likes || 0}</span>
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={userReaction === 'dislike' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleReaction('dislike')}
          className={cn(
            "flex gap-2 items-center",
            userReaction === 'dislike' && "bg-red-500 hover:bg-red-600 text-white"
          )}
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="font-medium">{dislikes || 0}</span>
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={isExpanded ? 'default' : 'ghost'}
          size="sm"
          onClick={onToggleComments}
          className={cn(
            "flex gap-2 items-center",
            isExpanded && "bg-blue-500 hover:bg-blue-600 text-white"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">{commentCount}</span>
        </Button>
      </motion.div>
    </div>
  );
};