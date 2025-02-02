import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";

interface MessagesContentProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onBack: () => void;
  receiver?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export function MessagesContent({
  messages,
  inputMessage,
  isListening,
  isThinking,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat,
  onBack,
  receiver
}: MessagesContentProps) {
  const { profile } = useProfile();
  const isAIChat = !receiver?.full_name;

  // If it's the AI chat (Mr. Victaure), use the original layout
  if (isAIChat) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col pt-14">
        <ChatHeader
          onBack={onBack}
          title="M. Victaure"
          subtitle="Assistant de Placement Virtuel"
          avatarUrl="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png"
          isThinking={isThinking}
        />

        <div className="flex-1 overflow-hidden bg-background/80">
          <ScrollArea className="h-full px-4 py-4">
            <div className="max-w-5xl mx-auto space-y-4 pb-20">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    content={message.content}
                    sender={message.sender_id === profile?.id ? "user" : "assistant"}
                    thinking={message.thinking}
                    showTimestamp={true}
                    timestamp={message.created_at}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        <div className="fixed bottom-0 left-0 right-0 shrink-0 border-t bg-background/95 backdrop-blur-sm p-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <ChatInput
              value={inputMessage}
              onChange={setInputMessage}
              onSend={() => onSendMessage(inputMessage)}
              onVoiceInput={onVoiceInput}
              isListening={isListening}
              isThinking={isThinking}
              placeholder="Écrivez votre message..."
              className="w-full"
            />
          </div>
        </div>
      </div>
    );
  }

  // For user-to-user chat, use the new layout with input at the top
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col pt-14">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center h-14 px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <div className="min-w-0">
              <h2 className="text-base font-semibold truncate">
                {receiver?.full_name || "Utilisateur"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col-reverse p-4 gap-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender_id === profile?.id ? "user" : "assistant"}
                  thinking={message.thinking}
                  showTimestamp={true}
                  timestamp={message.created_at}
                />
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      <div className="border-t bg-background/95 backdrop-blur-sm px-4 py-3 pb-20">
        <div className="flex gap-2">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 bg-muted/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            size="icon"
            className="rounded-full shrink-0"
            onClick={() => onSendMessage(inputMessage)}
            disabled={!inputMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}