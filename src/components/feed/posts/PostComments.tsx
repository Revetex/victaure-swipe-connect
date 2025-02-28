
import { ReactNode, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Comment } from "./types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface PostCommentsProps {
  postId: string;
  comments?: Comment[];
  currentUserId: string;
  onDeleteComment?: (commentId: string) => Promise<void>;
}

export function PostComments({
  postId,
  comments = [],
  currentUserId,
  onDeleteComment
}: PostCommentsProps): ReactNode {
  const [expandedComment, setExpandedComment] = useState<string | null>(null);

  const toggleComment = (commentId: string) => {
    setExpandedComment(expandedComment === commentId ? null : commentId);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (onDeleteComment) {
      await onDeleteComment(commentId);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        Aucun commentaire pour l'instant
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author?.avatar_url} />
            <AvatarFallback>
              {comment.author?.full_name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="bg-muted p-3 rounded-md">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  {comment.author?.full_name || "Utilisateur"}
                </h4>
                
                {comment.user_id === currentUserId && onDeleteComment && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <p className={`text-sm ${expandedComment === comment.id ? "" : "line-clamp-3"}`}>
                {comment.content}
              </p>
              
              {comment.content.length > 150 && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => toggleComment(comment.id)}
                >
                  {expandedComment === comment.id ? "Voir moins" : "Voir plus"}
                </Button>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
                locale: fr
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
