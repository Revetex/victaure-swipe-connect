
import { ReactionControls } from "./actions/ReactionControls";
import { CommentButton } from "./actions/CommentButton";
import { Separator } from "@/components/ui/separator";

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
  onLike,
  onDislike,
  onToggleComments,
}: PostActionsProps) {
  return (
    <div>
      <Separator className="my-4" />
      <div className="flex gap-2 items-center py-2">
        <ReactionControls
          likes={likes}
          dislikes={dislikes}
          userReaction={userReaction}
          postId={postId}
          postAuthorId={postAuthorId}
          currentUserId={currentUserId}
          userEmail={userEmail}
          onLike={onLike}
          onDislike={onDislike}
        />
        
        <CommentButton
          commentCount={commentCount}
          isExpanded={isExpanded}
          onToggleComments={onToggleComments}
        />
      </div>
    </div>
  );
}
