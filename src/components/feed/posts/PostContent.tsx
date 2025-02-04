import { Button } from "@/components/ui/button";
import { EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { Comment } from "@/types/posts";

interface PostContentProps {
  content: string;
  images?: string[];
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  comments?: Comment[];
  onReaction: (type: 'like' | 'dislike') => void;
  onCommentAdded: () => void;
  onDelete?: () => void;
  onHide?: () => void;
  postUserId?: string;
  currentUserId?: string;
  userEmail?: string;
}

export function PostContent({
  content,
  images,
  likes,
  dislikes,
  commentCount,
  userReaction,
  comments,
  onReaction,
  onCommentAdded,
  onDelete,
  onHide,
  postUserId,
  currentUserId,
  userEmail
}: PostContentProps) {
  const [showComments, setShowComments] = useState(false);

  const handleReaction = (type: 'like' | 'dislike') => {
    onReaction(type);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-300">{content}</div>
      
      {images && images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="rounded-lg object-cover w-full h-48"
            />
          ))}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <Button
          variant={userReaction === 'like' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleReaction('like')}
        >
          Like ({likes})
        </Button>
        <Button
          variant={userReaction === 'dislike' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleReaction('dislike')}
        >
          Dislike ({dislikes})
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComments(!showComments)}
        >
          Comments ({commentCount})
        </Button>

        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        {onHide && (
          <Button
            variant="outline"
            size="sm"
            onClick={onHide}
            className="text-gray-500 hover:text-gray-600"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showComments && comments && comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <img
                src={comment.profiles.avatar_url || '/user-icon.svg'}
                alt={comment.profiles.full_name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-semibold">{comment.profiles.full_name}</div>
                <div className="text-sm">{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}