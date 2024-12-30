import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ConversationViewProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  profile: any;
  onBack: () => void;
  onSendMessage: (message: string, profile: any) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
}

export function ConversationView({
  messages,
  inputMessage,
  isListening,
  isThinking,
  profile,
  onBack,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat,
}: ConversationViewProps) {
  const handleClearChat = async () => {
    try {
      await onClearChat();
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
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
          <Bot className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              thinking={message.thinking}
              showTimestamp={
                index === 0 || 
                messages[index - 1]?.sender !== message.sender ||
                new Date(message.timestamp).getTime() - new Date(messages[index - 1]?.timestamp).getTime() > 300000
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
          onSend={() => onSendMessage(inputMessage, profile)}
          onVoiceInput={onVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
        />
      </div>
    </motion.div>
  );
}