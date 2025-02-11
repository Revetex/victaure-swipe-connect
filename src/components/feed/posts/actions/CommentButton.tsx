
import { MessageCircle } from "lucide-react";
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
      icon={MessageCircle}
      count={commentCount}
      isActive={isExpanded}
      onClick={onToggleComments}
      activeClassName="bg-gradient-to-tr from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
    />
  );
}
