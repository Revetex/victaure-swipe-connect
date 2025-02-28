
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { MoreHorizontal, AlertCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PostActions } from "./actions/PostActions";
import { PostComments } from "./PostComments";
import { PostImageGrid } from "./PostImageGrid";
import { Post } from "./types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  currentUserId: string;
  userEmail: string;
  userReaction: 'like' | 'dislike' | null;
  onReaction: (postId: string, type: 'like' | 'dislike') => void;
  onHide: (postId: string) => void;
  onReport?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onShare?: () => void;
}

export function PostCard({
  post,
  currentUserId,
  userEmail,
  userReaction,
  onReaction,
  onHide,
  onReport,
  onDelete,
  onShare
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const isAuthor = post.user_id === currentUserId;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: fr });
  
  const handleToggleComments = () => {
    setShowComments(prev => !prev);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 bg-black/40 hover:bg-black/50 backdrop-blur-sm border-zinc-800/50",
        showComments && "shadow-lg"
      )}>
        <CardHeader className="p-4 flex flex-row items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author?.avatar_url || ''} />
              <AvatarFallback>{post.author?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author?.full_name || 'Utilisateur inconnu'}</div>
              <div className="text-xs text-muted-foreground">{timeAgo}</div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onHide(post.id)}>
                Masquer
              </DropdownMenuItem>
              {!isAuthor && onReport && (
                <DropdownMenuItem onClick={() => onReport(post.id)} className="text-red-500">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Signaler
                </DropdownMenuItem>
              )}
              {isAuthor && onDelete && (
                <DropdownMenuItem onClick={() => onDelete(post.id)} className="text-red-500">
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <div className="whitespace-pre-wrap mb-4">{post.content}</div>
          
          {post.images && post.images.length > 0 && (
            <PostImageGrid images={post.images} />
          )}
        </CardContent>
        
        <CardFooter className="px-4 py-2 border-t border-border/5 flex flex-col">
          <PostActions
            likes={post.likes || 0}
            dislikes={post.dislikes || 0}
            commentCount={post.comment_count || 0}
            userReaction={userReaction}
            isExpanded={showComments}
            postId={post.id}
            postAuthorId={post.user_id}
            currentUserId={currentUserId}
            userEmail={userEmail}
            onToggleComments={handleToggleComments}
            onReaction={onReaction}
          />
          
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full pt-3 pb-1"
              >
                <PostComments postId={post.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
