import { Message, Receiver } from "@/types/messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FriendSelector } from "./FriendSelector";
import { motion, AnimatePresence } from "framer-motion";

interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: Receiver) => void;
}

export function ConversationList({
  messages,
  chatMessages,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Messages
          </h2>
          <FriendSelector 
            onSelectFriend={(friendId) => 
              onSelectConversation("user", { id: friendId } as Receiver)
            }
          >
            <Button size="icon" variant="ghost" className="rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </FriendSelector>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            className="pl-9 w-full bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>
      </motion.div>

      <ScrollArea className="flex-1">
        <AnimatePresence mode="popLayout">
          <div className="p-4 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AssistantMessage
                chatMessages={chatMessages}
                onSelectConversation={() => onSelectConversation("assistant")}
              />
            </motion.div>
            
            <div className="space-y-2">
              {messages
                .filter((message) => 
                  message.sender.full_name?.toLowerCase().includes(searchQuery) ||
                  message.content.toLowerCase().includes(searchQuery)
                )
                .map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserMessage
                      message={message}
                      onSelect={() => onSelectConversation("user", message.sender)}
                    />
                  </motion.div>
                ))}
            </div>
          </div>
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
}