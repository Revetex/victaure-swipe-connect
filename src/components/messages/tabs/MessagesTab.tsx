import { MessageSquare, Maximize2, Minimize2 } from "lucide-react";
import { MessageList } from "../MessageList";
import { useMessages } from "@/hooks/useMessages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  const { profile } = useProfile();
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
  } = useChat();
  
  return (
    <div className="space-y-4">
      {/* Assistant Chat Section - Pinned */}
      <div 
        className={cn(
          "bg-background/50 rounded-lg border border-border/50 shadow-sm transition-all duration-300",
          isExpanded ? "fixed inset-4 z-50 bg-background" : "relative p-4"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-victaure-blue" />
            <h3 className="font-medium text-victaure-blue">Mr. Victaure - Assistant IA</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-victaure-blue/10"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div 
          className={cn(
            "overflow-y-auto scrollbar-thin scrollbar-thumb-victaure-blue/20 scrollbar-track-transparent",
            isExpanded ? "h-[calc(100%-8rem)] px-4" : "max-h-[200px] mb-4"
          )}
        >
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
        </div>

        <div className={cn("p-4", isExpanded ? "absolute bottom-0 left-0 right-0" : "")}>
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={() => handleSendMessage(inputMessage, profile)}
            onVoiceInput={handleVoiceInput}
            isListening={isListening}
            isThinking={isThinking}
          />
        </div>
      </div>

      {/* User Messages Section - Hidden when chat is expanded */}
      {!isExpanded && (
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
      )}
    </div>
  );
}