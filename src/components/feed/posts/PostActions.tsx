import { Button } from "@/components/ui/button";
import { EyeOff, Trash2 } from "lucide-react";

interface PostActionsProps {
  currentUserId?: string;
  postUserId: string;
  onDelete: () => void;
  onHide: () => void;
}

export const PostActions = ({ currentUserId, postUserId, onDelete, onHide }: PostActionsProps) => {
  return (
    <div className="flex gap-2 absolute right-4 top-4">
      {postUserId === currentUserId ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={onHide}
        >
          <EyeOff className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};