import { Bot, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    clearChat,
  } = useChat();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [chatMessages]);

  const handleClearChat = async () => {
    try {
      await clearChat();
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-background rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 ${isThinking ? 'animate-pulse' : 'hover:bg-primary/20'}`}>
              <Bot className="h-6 w-6 text-primary" />
            </div>
          </div>
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full px-4 py-6">
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
                timestamp={message.timestamp?.toString()}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t mt-auto">
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
  );
}