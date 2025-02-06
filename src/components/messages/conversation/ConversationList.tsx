import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, Receiver } from "@/types/messages";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { filterMessages } from "@/utils/messageUtils";

export interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", selectedReceiver?: Receiver) => void;
}

export function ConversationList({ messages, chatMessages, onSelectConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { profile } = useProfile();
  
  // Get unique conversations by grouping messages by sender/receiver
  const conversations = messages.reduce((acc: any[], message: Message) => {
    const otherUser = message.sender_id === profile?.id ? message.receiver : message.sender;
    if (!otherUser) return acc;
    
    const existingConv = acc.find(conv => conv.user.id === otherUser.id);
    if (!existingConv) {
      acc.push({
        user: otherUser,
        lastMessage: message
      });
    } else if (new Date(message.created_at) > new Date(existingConv.lastMessage.created_at)) {
      existingConv.lastMessage = message;
    }
    return acc;
  }, []);

  const filteredConversations = conversations.filter(conv => 
    conv.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
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
            </Button>
          </motion.div>

          {filteredConversations.map((conv) => (
            <motion.div
              key={conv.user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 h-auto p-4"
                onClick={() => onSelectConversation("user", conv.user)}
              >
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{conv.user.full_name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.lastMessage.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage.content}
                  </p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}