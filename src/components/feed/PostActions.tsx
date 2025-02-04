import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  isExpanded: boolean;
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
  onLike,
  onDislike,
  onToggleComments,
}: PostActionsProps) => {
  return (
    <div className="flex gap-2 items-center py-2">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={userReaction === 'like' ? 'default' : 'ghost'}
          size="sm"
          onClick={onLike}
          className={cn(
            "flex gap-2 items-center",
            userReaction === 'like' && "bg-green-500 hover:bg-green-600 text-white"
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-medium">{likes}</span>
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={userReaction === 'dislike' ? 'default' : 'ghost'}
          size="sm"
          onClick={onDislike}
          className={cn(
            "flex gap-2 items-center",
            userReaction === 'dislike' && "bg-red-500 hover:bg-red-600 text-white"
          )}
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="font-medium">{dislikes}</span>
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