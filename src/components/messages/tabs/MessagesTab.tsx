import { MessageSquare } from "lucide-react";
import { MessageList } from "../MessageList";
import { useMessages } from "@/hooks/useMessages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  const { profile } = useProfile();
  const [isAssistantChatOpen, setIsAssistantChatOpen] = useState(false);
  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
  } = useChat();

  const handleClearChat = async () => {
    try {
      await clearChat();
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  const lastAssistantMessage = chatMessages[chatMessages.length - 1]?.content || "Comment puis-je vous aider ?";
  
  return (
    <div className="space-y-4">
      {/* Assistant Message Item */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsAssistantChatOpen(true)}
        className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] bg-muted hover:bg-muted/80"
      >
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/bot-avatar.png" alt="Mr. Victaure" />
            <AvatarFallback className="bg-victaure-blue/20">
              <Bot className="h-5 w-5 text-victaure-blue" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-medium truncate">Mr. Victaure</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Assistant IA
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {lastAssistantMessage}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Assistant Chat Dialog */}
      <Dialog open={isAssistantChatOpen} onOpenChange={setIsAssistantChatOpen}>
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/bot-avatar.png" alt="Mr. Victaure" />
                <AvatarFallback className="bg-victaure-blue/20">
                  <Bot className="h-5 w-5 text-victaure-blue" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">Mr. Victaure</h2>
                <p className="text-sm text-muted-foreground">
                  {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearChat}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                  thinking={message.thinking}
                  showTimestamp={
                    index === 0 || 
                    chatMessages[index - 1]?.sender !== message.sender ||
                    new Date(message.timestamp).getTime() - new Date(chatMessages[index - 1]?.timestamp).getTime() > 300000
                  }
                  timestamp={message.timestamp}
                />
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={() => handleSendMessage(inputMessage, profile)}
              onVoiceInput={handleVoiceInput}
              isListening={isListening}
              isThinking={isThinking}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* User Messages Section */}
      <div>
        <div className="flex items-center gap-2 text-primary mb-4">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <MessageList
          messages={userMessages}
          isLoading={isLoading}
          onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
        />
      </div>
    </div>
  );
}