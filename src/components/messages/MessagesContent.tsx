import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface MessagesContentProps {
  messages: any[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string, model?: string) => void;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onBack?: () => void;
  showingChat?: boolean;
}

export function MessagesContent({
  messages = [], // Add default empty array
  inputMessage = "", // Add default empty string
  isListening = false, // Add default false
  isThinking = false, // Add default false
  onSendMessage,
  onVoiceInput = () => {}, // Add default noop function
  setInputMessage = () => {}, // Add default noop function
  onClearChat = () => {}, // Add default noop function
  onBack,
  showingChat,
}: MessagesContentProps) {
  const [selectedModel, setSelectedModel] = useState("mistralai/Mixtral-8x7B-Instruct-v0.1");

  const handleSendMessage = () => {
    if (onSendMessage) {
      onSendMessage(inputMessage, selectedModel);
    }
  };

  // Ensure messages is always an array
  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex flex-col h-full">
      <header className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="text-lg font-semibold">M. Victaure</h2>
              <p className="text-sm text-muted-foreground">
                {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearChat}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {safeMessages.map((message, index) => (
            <ChatMessage
              key={message.id || index}
              content={message.content || ""}
              sender={message.sender || "user"}
              thinking={!!message.thinking}
              showTimestamp={
                index === 0 || 
                safeMessages[index - 1]?.sender !== message.sender ||
                new Date(message.timestamp).getTime() - new Date(safeMessages[index - 1]?.timestamp).getTime() > 300000
              }
              timestamp={message.timestamp}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t">
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          onVoiceInput={onVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
    </div>
  );
}