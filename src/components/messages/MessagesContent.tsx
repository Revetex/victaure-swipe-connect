import { ConversationView } from "./conversation/ConversationView";
import { MessagesList } from "./conversation/MessagesList";
import { useProfile } from "@/hooks/useProfile";
import { useMessages } from "@/hooks/useMessages";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface MessagesContentProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string, profile: any) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
}

export function MessagesContent({
  messages: chatMessages,
  inputMessage,
  isListening,
  isThinking,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat
}: MessagesContentProps) {
  const { profile } = useProfile();
  const { messages, markAsRead } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<"list" | "assistant">("list");

  const handleBack = () => {
    setSelectedConversation("list");
  };

  const handleSelectConversation = (type: "assistant") => {
    setSelectedConversation(type);
  };

  if (selectedConversation === "assistant") {
    return (
      <div className="h-full">
        <ConversationView
          messages={chatMessages}
          inputMessage={inputMessage}
          isListening={isListening}
          isThinking={isThinking}
          profile={profile}
          onBack={handleBack}
          onSendMessage={onSendMessage}
          onVoiceInput={onVoiceInput}
          setInputMessage={setInputMessage}
          onClearChat={onClearChat}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-sm text-muted-foreground">
                Gérez vos conversations et restez connecté
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-hidden">
        <MessagesList
          messages={messages}
          chatMessages={chatMessages}
          onSelectConversation={handleSelectConversation}
          onMarkAsRead={(messageId) => markAsRead.mutate(messageId)}
        />
      </div>
    </div>
  );
}