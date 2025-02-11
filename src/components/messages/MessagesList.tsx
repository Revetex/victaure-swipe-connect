
import { Message } from "@/types/messages";
import { MessageItem } from "./MessageItem"; // Updated import path
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfile } from "@/hooks/useProfile";
import { Bot, RefreshCcw } from "lucide-react";
import { FriendSelector } from "./conversation/FriendSelector";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface MessagesListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: any) => void;
  isLoading?: boolean;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation,
  isLoading = false
}: MessagesListProps) {
  const { profile } = useProfile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const queryClient = useQueryClient();
  
  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    if (!target) return;

    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    setIsNearBottom(isBottom);
  };

  const handleDeleteAIConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      const { error } = await supabase.rpc('delete_ai_conversation', {
        p_user_id: user.id
      });

      if (error) throw error;

      toast.success("Conversation avec l'assistant supprimée");
      queryClient.invalidateQueries({ queryKey: ['messages'] });

    } catch (error) {
      console.error('Error deleting AI conversation:', error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['messages'] });
    toast.success("Messages rafraîchis");
  };

  useEffect(() => {
    if (isNearBottom && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isNearBottom]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-[100vh]">
        <div className="border-b p-4 flex items-center justify-between gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[100vh] bg-background">
      <div className="border-b p-4 flex items-center justify-between gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="text-lg font-semibold">Messages</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="shrink-0"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <FriendSelector onSelectFriend={(friendId) => onSelectConversation("user", { id: friendId })} />
        </div>
      </div>

      <ScrollArea 
        className="flex-1"
        onScrollCapture={handleScroll}
      >
        <div className="p-4 space-y-4">
          {/* Assistant AI - M. Victaure épinglé en haut */}
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 h-auto p-4 bg-primary/5 hover:bg-primary/10"
              onClick={() => onSelectConversation("assistant")}
            >
              <Bot className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <h3 className="font-medium">M. Victaure</h3>
                <p className="text-sm text-muted-foreground">Assistant virtuel</p>
              </div>
              {chatMessages.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {new Date(chatMessages[chatMessages.length - 1].created_at).toLocaleDateString()}
                </span>
              )}
            </Button>
            {chatMessages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAIConversation}
                className="mt-2 text-destructive hover:text-destructive"
              >
                Supprimer la conversation
              </Button>
            )}
          </div>

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <MessageItem
                key={message.id}
                id={message.id}
                content={message.content}
                sender={typeof message.sender === 'string' ? {
                  id: message.sender_id,
                  full_name: message.sender,
                  avatar_url: '',
                  online_status: false,
                  last_seen: new Date().toISOString()
                } : message.sender}
                created_at={message.created_at}
                read={message.read}
                status={message.status}
                onMarkAsRead={() => {}}
              />
            </motion.div>
          ))}

          {messages.length === 0 && !isLoading && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Aucune conversation
            </p>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
