
import { MessageSquare } from "lucide-react";
import { ReactionButton } from "./ReactionButton";

interface CommentButtonProps {
  commentCount: number;
  isExpanded: boolean;
  onToggleComments: () => void;
}

export function CommentButton({
  commentCount,
  isExpanded,
  onToggleComments
}: CommentButtonProps) {
  return (
    <ReactionButton
      icon={MessageSquare}
      count={commentCount}
      isActive={isExpanded}
      onClick={onToggleComments}
      label="Commentaires"
      activeClassName="bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400"
    />
  );
}
