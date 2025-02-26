
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useReactions } from "./actions/useReactions";
import { ReactionButton } from "./actions/ReactionButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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

  useEffect(() => {
    setLocalLikes(likes);
    setLocalDislikes(dislikes);
    setLocalUserReaction(userReaction);
  }, [likes, dislikes, userReaction]);

  const { handleReaction } = useReactions({
    postId,
    postAuthorId,
    currentUserId,
    userEmail,
    userReaction: localUserReaction
  });

  const handleLocalReaction = async (type: 'like' | 'dislike') => {
    // Mise à jour optimiste de l'UI
    if (localUserReaction === type) {
      // Si on retire la réaction
      setLocalUserReaction(undefined);
      if (type === 'like') {
        setLocalLikes(prev => Math.max(0, prev - 1));
      } else {
        setLocalDislikes(prev => Math.max(0, prev - 1));
      }
    } else {
      // Si on change de réaction ou on ajoute une nouvelle
      if (localUserReaction) {
        // Si on change de type de réaction
        if (localUserReaction === 'like') {
          setLocalLikes(prev => Math.max(0, prev - 1));
          setLocalDislikes(prev => prev + 1);
        } else {
          setLocalDislikes(prev => Math.max(0, prev - 1));
          setLocalLikes(prev => prev + 1);
        }
      } else {
        // Si on ajoute une nouvelle réaction
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
  };

  useEffect(() => {
    const channel = supabase
      .channel('post-reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `id=eq.${postId}`
        },
        (payload: RealtimePostgresChangesPayload<PostPayload>) => {
          const newPost = payload.new as PostPayload;
          if (newPost && typeof newPost.likes === 'number' && typeof newPost.dislikes === 'number') {
            setLocalLikes(newPost.likes);
            setLocalDislikes(newPost.dislikes);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  return (
    <div className="flex gap-2 items-center py-2">
      <div className="flex items-center gap-2">
        <ReactionButton
          icon={ThumbsUp}
          count={localLikes}
          isActive={localUserReaction === 'like'}
          onClick={() => handleLocalReaction('like')}
          activeClassName="bg-primary/10 hover:bg-primary/20 text-primary"
        />
        <ReactionButton
          icon={ThumbsDown}
          count={localDislikes}
          isActive={localUserReaction === 'dislike'}
          onClick={() => handleLocalReaction('dislike')}
          activeClassName="bg-destructive/10 hover:bg-destructive/20 text-destructive"
        />
      </div>

      <div className="flex items-center gap-2">
        <ReactionButton
          icon={MessageSquare}
          count={commentCount}
          isActive={isExpanded}
          onClick={onToggleComments}
          activeClassName="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
        />
      </div>
    </div>
  );
}
