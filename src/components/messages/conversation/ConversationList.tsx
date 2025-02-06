
import { Message, Receiver } from "@/types/messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b"
      >
        <div className="flex items-center justify-end">
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
              {messages.map((message) => (
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
