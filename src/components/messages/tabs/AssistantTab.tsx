import { Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useRef, useEffect } from "react";

export function AssistantTab() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
  } = useChat();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="h-[500px] flex flex-col">
      <div className="flex items-center p-4 relative border-b border-victaure-blue/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`h-12 w-12 rounded-full bg-victaure-blue/20 flex items-center justify-center transition-all duration-300 ${isThinking ? 'bg-victaure-blue/30' : 'hover:bg-victaure-blue/30'}`}>
              <Bot className={`h-6 w-6 text-victaure-blue ${isThinking ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Mr. Victaure</h2>
            <p className="text-sm text-muted-foreground">
              {isThinking ? "En train de réfléchir..." : "Assistant IA Personnel"}
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollAreaRef}
        className="flex-grow overflow-y-auto mb-4 px-4 scrollbar-thin scrollbar-thumb-victaure-blue/20 scrollbar-track-transparent"
      >
        <div className="space-y-4 py-4">
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

      <div className="p-4 pt-0">

<ChatInput
  value={inputMessage}
  onChange={setInputMessage}
  onSend={() => handleSendMessage(inputMessage)}
  onVoiceInput={handleVoiceInput}
  isListening={isListening}
  isThinking={isThinking}
/>

      </div>
    </div>
  );
}
