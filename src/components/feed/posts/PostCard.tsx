import { Card } from "@/components/ui/card";
import { PostHeader } from "../PostHeader";
import { PostActions } from "./PostActions";
import { PostContent } from "./PostContent";
import { PostImageGrid } from "./PostImageGrid";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    images: string[];
    created_at: string;
    user_id: string;
    privacy_level: "public" | "connections";
    profiles: {
      id: string;
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
        id: string;
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
      
      <PostActions
        currentUserId={currentUserId}
        postUserId={post.user_id}
        onDelete={() => onDelete(post.id)}
        onHide={() => onHide(post.id)}
      />

      <PostContent
        content={post.content}
        postId={post.id}
        currentUserId={currentUserId}
        userEmail={userEmail}
        likes={likes}
        dislikes={dislikes}
        commentCount={commentCount}
        userReaction={userReaction}
        comments={post.comments}
        onReaction={(type) => onReaction(post.id, type)}
        onCommentAdded={onCommentAdded}
      />

      <PostImageGrid images={post.images} />
    </Card>
  );
};