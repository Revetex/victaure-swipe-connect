
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
      activeClassName="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
    />
  );
}
