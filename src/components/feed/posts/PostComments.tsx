
import { ReactNode, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface PostCommentsProps {
  postId: string;
}

export function PostComments({ postId }: PostCommentsProps): ReactNode {
  const [comment, setComment] = useState("");
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });

  const { data: comments = [], refetch } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("post_comments")
        .select(`
          *,
          author:profiles(id, full_name, avatar_url)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      
      return data || [];
    }
  });

  const handleSubmitComment = async () => {
    if (!comment.trim() || !user) return;

    await supabase.from("post_comments").insert({
      content: comment,
      post_id: postId,
      user_id: user.id
    });

    setComment("");
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-3 text-muted-foreground">
            Aucun commentaire pour le moment
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author?.avatar_url || ''} />
                <AvatarFallback>{comment.author?.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="bg-muted/20 rounded-lg p-3">
                  <div className="font-medium text-sm">{comment.author?.full_name || 'Utilisateur inconnu'}</div>
                  <div className="text-sm">{comment.content}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: fr })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
          <AvatarFallback>{user?.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="bg-muted/20"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
          />
          <Button size="icon" onClick={handleSubmitComment} disabled={!comment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
