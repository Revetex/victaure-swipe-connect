import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, EyeOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface PostActionsProps {
  likes: number;
  dislikes: number;
  commentCount: number;
  userReaction?: string;
  isExpanded: boolean;
  isOwnPost: boolean;
  onLike: () => void;
  onDislike: () => void;
  onToggleComments: () => void;
  onHide?: () => void;
  onDelete?: () => void;
}

export const PostActions = ({
  likes,
  dislikes,
  commentCount,
  userReaction,
  isExpanded,
  isOwnPost,
  onLike,
  onDislike,
  onToggleComments,
  onHide,
  onDelete,
}: PostActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: () => void | Promise<void>) => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await action();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-2 items-center py-2">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={userReaction === 'like' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleAction(onLike)}
          disabled={isProcessing}
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
          onClick={() => handleAction(onDislike)}
          disabled={isProcessing}
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
          onClick={() => handleAction(onToggleComments)}
          disabled={isProcessing}
          className={cn(
            "flex gap-2 items-center",
            isExpanded && "bg-blue-500 hover:bg-blue-600 text-white"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">{commentCount}</span>
        </Button>
      </motion.div>

      {!isOwnPost && onHide && (
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction(onHide)}
            disabled={isProcessing}
            className="flex gap-2 items-center text-muted-foreground hover:text-foreground"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {isOwnPost && onDelete && (
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction(onDelete)}
            disabled={isProcessing}
            className="flex gap-2 items-center text-destructive hover:text-destructive/80"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};