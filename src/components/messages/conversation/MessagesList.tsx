import { Message } from "@/types/messages";
import { MessageItem } from "../MessageItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfile } from "@/hooks/useProfile";
import { Bot, Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FriendSelector } from "./FriendSelector";
import { motion } from "framer-motion";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = messages.filter(message => {
    const senderName = typeof message.sender === 'string' 
      ? message.sender 
      : message.sender.full_name;
    return senderName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleMarkAsRead = (messageId: string) => {
    // This will be handled by the parent component
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <FriendSelector onSelectFriend={(friendId) => onSelectConversation("user", { id: friendId })} />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 h-auto p-4"
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
          </motion.div>

          {filteredMessages.map((message) => (
            <MessageItem
              key={message.id}
              id={message.id}
              content={message.content}
              sender={typeof message.sender === 'string' ? {
                id: message.sender_id,
                full_name: message.sender,
                avatar_url: ''
              } : message.sender}
              created_at={message.created_at}
              read={message.read}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}