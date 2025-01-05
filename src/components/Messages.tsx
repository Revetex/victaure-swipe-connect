import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { useNavigate, useLocation } from "react-router-dom";
import { Bot, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function Messages() {
  const {
    messages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  } = useChat();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're in a specific conversation
  const isInConversation = location.pathname.includes("/messages/");

  // If we're in a conversation, show the chat interface
  if (isInConversation) {
    return (
      <MessagesContent
        messages={messages}
        inputMessage={inputMessage}
        isListening={isListening}
        isThinking={isThinking}
        onSendMessage={handleSendMessage}
        onVoiceInput={handleVoiceInput}
        setInputMessage={setInputMessage}
        onClearChat={clearChat}
      />
    );
  }

  // Otherwise, show the conversations list
  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm">
      <header className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
        <h1 className="text-lg font-semibold">Messages</h1>
      </header>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {/* Mr. Victaure - Pinned */}
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent",
              "border-l-4 border-primary"
            )}
            onClick={() => navigate("/dashboard/messages/victaure")}
          >
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src="/lovable-uploads/aac4a714-ce15-43fe-a9a6-c6ddffefb6ff.png" alt="Mr. Victaure" />
              <AvatarFallback className="bg-primary/20">
                <Bot className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">M. Victaure</h3>
              <p className="text-sm text-muted-foreground">Assistant IA Personnel</p>
            </div>
          </Button>

          {/* Conseiller - Regular */}
          <Button
            variant="ghost"
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent"
            onClick={() => navigate("/dashboard/messages/advisor")}
          >
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src="/lovable-uploads/78b41840-19a1-401c-a34f-864298825f44.png" alt="Conseiller" />
              <AvatarFallback className="bg-primary/20">
                <MessageSquare className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <h3 className="font-semibold">Conseiller</h3>
              <p className="text-sm text-muted-foreground">Conseiller en Orientation</p>
            </div>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
