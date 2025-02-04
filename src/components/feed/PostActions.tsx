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

    try {
      // First, check if the user has already reacted
      const { data: existingReaction } = await supabase
        .from('post_reactions')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', currentUserId)
        .maybeSingle();

      let action: 'insert' | 'delete' | 'update' = 'insert';
      
      if (existingReaction) {
        if (existingReaction.reaction_type === type) {
          action = 'delete';
        } else {
          action = 'update';
        }
      }

      // Perform the appropriate action
      if (action === 'delete') {
        await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUserId);
      } else if (action === 'update') {
        await supabase
          .from('post_reactions')
          .update({ reaction_type: type })
          .eq('post_id', postId)
          .eq('user_id', currentUserId);
      } else {
        await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: currentUserId,
            reaction_type: type
          });
      }

      // Update the likes/dislikes count in the posts table
      const { data: reactions } = await supabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId);

      const newLikes = reactions?.filter(r => r.reaction_type === 'like').length || 0;
      const newDislikes = reactions?.filter(r => r.reaction_type === 'dislike').length || 0;

      await supabase
        .from('posts')
        .update({
          likes: newLikes,
          dislikes: newDislikes
        })
        .eq('id', postId);

      // Call the appropriate callback
      if (type === 'like') {
        onLike();
        if (action !== 'delete' && postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau j\'aime',
            `${userEmail} a aimé votre publication`
          );
        }
      } else {
        onDislike();
        if (action !== 'delete' && postAuthorId !== currentUserId) {
          await createNotification(
            postAuthorId,
            'Nouveau je n\'aime pas',
            `${userEmail} n'a pas aimé votre publication`
          );
        }
      }

      toast({
        title: action === 'delete' ? "Réaction supprimée" : "Réaction ajoutée",
        description: action === 'delete' ? 
          "Votre réaction a été supprimée" : 
          `Vous avez ${type === 'like' ? 'aimé' : 'pas aimé'} cette publication`,
      });

    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réaction",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2 items-center py-2">
      <motion.div 
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="will-change-transform"
      >
        <Button
          variant={userReaction === 'like' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleReaction('like')}
          className={cn(
            "flex gap-2 items-center transition-all duration-150",
            userReaction === 'like' && "bg-green-500 hover:bg-green-600 text-white shadow-lg"
          )}
        >
          <ThumbsUp className={cn(
            "h-4 w-4 transition-transform",
            userReaction === 'like' && "scale-110"
          )} />
          <span className="font-medium">{likes || 0}</span>
        </Button>
      </motion.div>

      <motion.div 
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="will-change-transform"
      >
        <Button
          variant={userReaction === 'dislike' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleReaction('dislike')}
          className={cn(
            "flex gap-2 items-center transition-all duration-150",
            userReaction === 'dislike' && "bg-red-500 hover:bg-red-600 text-white shadow-lg"
          )}
        >
          <ThumbsDown className={cn(
            "h-4 w-4 transition-transform",
            userReaction === 'dislike' && "scale-110"
          )} />
          <span className="font-medium">{dislikes || 0}</span>
        </Button>
      </motion.div>

      <motion.div 
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="will-change-transform"
      >
        <Button
          variant={isExpanded ? 'default' : 'ghost'}
          size="sm"
          onClick={onToggleComments}
          className={cn(
            "flex gap-2 items-center transition-all duration-150",
            isExpanded && "bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          )}
        >
          <MessageSquare className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "scale-110"
          )} />
          <span className="font-medium">{commentCount}</span>
        </Button>
      </motion.div>
    </div>
  );
};