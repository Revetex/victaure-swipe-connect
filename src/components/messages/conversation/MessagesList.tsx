
import { Message, Receiver } from "@/types/messages";
import { MessageItem } from "../MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfile } from "@/hooks/useProfile";
import { Bot } from "lucide-react";
import { FriendSelector } from "./FriendSelector";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MessagesListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: any) => void;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation
}: MessagesListProps) {
  const { profile } = useProfile();
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      <div className="border-b p-4 flex items-center justify-between gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="text-lg font-semibold">Messages</div>
        <FriendSelector onSelectFriend={(friendId) => onSelectConversation("user", { id: friendId })} />
      </div>

      <ScrollArea className="flex-1">
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
          </div>

          {/* Liste des conversations privées */}
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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

          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Aucune conversation
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
