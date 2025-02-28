import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useReactions } from "./actions/useReactions";
import { ReactionButton } from "./actions/ReactionButton";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";
interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: 'like' | 'dislike';
  isExpanded: boolean;
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  userEmail?: string;
  onToggleComments: () => void;
  onReaction?: (postId: string, type: 'like' | 'dislike') => void;
}
interface PostPayload {
  id: string;
  likes: number;
  dislikes: number;
  user_id: string;
  content: string;
  created_at: string;
}
export function PostActions({
  likes,
  dislikes,
  commentCount,
  userReaction,
  isExpanded,
  postId,
  postAuthorId,
  currentUserId,
  userEmail,
  onToggleComments,
  onReaction
}: PostActionsProps) {
  const [localLikes, setLocalLikes] = useState(likes);
  const [localDislikes, setLocalDislikes] = useState(dislikes);
  const [localUserReaction, setLocalUserReaction] = useState(userReaction);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    setLocalLikes(likes);
    setLocalDislikes(dislikes);
    setLocalUserReaction(userReaction);
  }, [likes, dislikes, userReaction]);
  const {
    handleReaction
  } = useReactions({
    postId,
    postAuthorId,
    currentUserId,
    userEmail,
    userReaction: localUserReaction
  });
  const handleLocalReaction = useCallback(async (type: 'like' | 'dislike') => {
    if (isProcessing || !currentUserId) {
      toast.error("Vous devez être connecté pour réagir");
      return;
    }
    setIsProcessing(true);
    try {
      // Mise à jour optimiste de l'UI
      if (localUserReaction === type) {
        // Retirer la réaction
        setLocalUserReaction(undefined);
        if (type === 'like') {
          setLocalLikes(prev => Math.max(0, prev - 1));
        } else {
          setLocalDislikes(prev => Math.max(0, prev - 1));
        }
      } else {
        // Si on change de réaction ou on ajoute une nouvelle
        if (localUserReaction) {
          // Changer de type de réaction
          if (localUserReaction === 'like') {
            setLocalLikes(prev => Math.max(0, prev - 1));
            setLocalDislikes(prev => prev + 1);
          } else {
            setLocalDislikes(prev => Math.max(0, prev - 1));
            setLocalLikes(prev => prev + 1);
          }
        } else {
          // Ajouter une nouvelle réaction
          if (type === 'like') {
            setLocalLikes(prev => prev + 1);
          } else {
            setLocalDislikes(prev => prev + 1);
          }
        }
        setLocalUserReaction(type);
      }

      // Appel à l'API pour mettre à jour en base
      await handleReaction(type);

      // Notifier le parent du changement
      if (onReaction) {
        onReaction(postId, type);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      // Rollback en cas d'erreur
      setLocalLikes(likes);
      setLocalDislikes(dislikes);
      setLocalUserReaction(userReaction);
      toast.error("Erreur lors de la réaction");
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, currentUserId, localUserReaction, handleReaction, likes, dislikes, userReaction, postId, onReaction]);
  useEffect(() => {
    const channel = supabase.channel('post-reactions').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'posts',
      filter: `id=eq.${postId}`
    }, (payload: RealtimePostgresChangesPayload<PostPayload>) => {
      if (!isProcessing && payload.new) {
        const newPost = payload.new as PostPayload;
        if (newPost && 'likes' in newPost && 'dislikes' in newPost && typeof newPost.likes === 'number' && typeof newPost.dislikes === 'number') {
          setLocalLikes(newPost.likes);
          setLocalDislikes(newPost.dislikes);
        }
      }
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, isProcessing]);
  return <div className="flex gap-2 items-center py-0">
      <div className="flex items-center gap-2">
        <ReactionButton icon={ThumbsUp} count={localLikes} isActive={localUserReaction === 'like'} onClick={() => handleLocalReaction('like')} activeClassName="bg-primary/10 hover:bg-primary/20 text-primary" />
        <ReactionButton icon={ThumbsDown} count={localDislikes} isActive={localUserReaction === 'dislike'} onClick={() => handleLocalReaction('dislike')} activeClassName="bg-destructive/10 hover:bg-destructive/20 text-destructive" />
      </div>

      <div className="flex items-center gap-2">
        <ReactionButton icon={MessageSquare} count={commentCount} isActive={isExpanded} onClick={onToggleComments} activeClassName="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500" />
      </div>
    </div>;
}