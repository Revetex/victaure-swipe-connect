import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { PostHeader } from "../PostHeader";
import { PostActions } from "../PostActions";
import { CommentManager } from "../comments/CommentManager";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    images: string[];
    created_at: string;
    user_id: string;
    privacy_level: "public" | "connections";
    profiles: {
      full_name: string;
      avatar_url: string;
    };
    reactions?: {
      reaction_type: string;
      user_id: string;
    }[];
    comments?: {
      id: string;
      content: string;
      created_at: string;
      user_id: string;
      profiles: {
        full_name: string;
        avatar_url: string;
      };
    }[];
  };
  currentUserId?: string;
  userEmail?: string;
  onDelete: (postId: string) => void;
  onHide: (postId: string) => void;
  onReaction: (postId: string, type: 'like' | 'dislike') => void;
  onCommentAdded: () => void;
}

export const PostCard = ({
  post,
  currentUserId,
  userEmail,
  onDelete,
  onHide,
  onReaction,
  onCommentAdded
}: PostCardProps) => {
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const likes = post.reactions?.filter(r => r.reaction_type === 'like').length || 0;
  const dislikes = post.reactions?.filter(r => r.reaction_type === 'dislike').length || 0;
  const userReaction = post.reactions?.find(r => r.user_id === currentUserId)?.reaction_type;
  const commentCount = post.comments?.length || 0;

  return (
    <Card className="p-4">
      <PostHeader
        profile={post.profiles}
        created_at={post.created_at}
        privacy_level={post.privacy_level}
      />
      
      <div className="flex gap-2 absolute right-4 top-4">
        {post.user_id === currentUserId ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(post.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onHide(post.id)}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.images.map((image, index) => (
            <div key={index} className="relative">
              {image.toLowerCase().endsWith('.pdf') ? (
                <a 
                  href={image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 bg-muted rounded hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-sm">Voir le PDF</span>
                  </div>
                </a>
              ) : (
                <img
                  src={image}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-48 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <PostActions
        likes={likes}
        dislikes={dislikes}
        commentCount={commentCount}
        userReaction={userReaction}
        isExpanded={isCommentsExpanded}
        onLike={() => onReaction(post.id, 'like')}
        onDislike={() => onReaction(post.id, 'dislike')}
        onToggleComments={() => setIsCommentsExpanded(!isCommentsExpanded)}
      />

      {isCommentsExpanded && post.comments && (
        <CommentManager
          postId={post.id}
          postAuthorId={post.user_id}
          currentUserId={currentUserId}
          userEmail={userEmail}
          comments={post.comments}
          onCommentAdded={onCommentAdded}
        />
      )}
    </Card>
  );
};