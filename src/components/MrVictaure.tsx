import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function MrVictaure() {
  const {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat,
  } = useChat();

  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div 
      className={cn(
        "glass-card flex flex-col relative overflow-hidden transition-all duration-300",
        isMaximized ? "fixed inset-4 z-50" : "h-[500px]"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-victaure-blue/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between p-4 relative border-b border-victaure-blue/10">
        <ChatHeader onClearChat={clearChat} isThinking={isThinking} />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMaximize}
          className="hover:bg-victaure-blue/10 ml-2"
        >
          {isMaximized ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-grow mb-4 pr-4 relative">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              thinking={message.thinking}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 pt-0">
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
        />
      </div>
    </div>
  );
}