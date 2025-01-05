import { Message } from "@/types/chat/messageTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Mic } from "lucide-react";
import { ChatMessage } from "../chat/ChatMessage";
import { ChatThinking } from "../chat/ChatThinking";

export interface MessagesContentProps {
  messages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => Promise<void>;
  onBack?: () => void; // Make onBack optional
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
  onBack
}: MessagesContentProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 border-b px-4 py-3 flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-lg font-semibold">Messages</h1>
          <p className="text-sm text-muted-foreground">
            Votre conversation avec M. Victaure
          </p>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isThinking && <ChatThinking />}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Écrivez votre message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!inputMessage.trim() || isThinking}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onVoiceInput}
            disabled={isListening || isThinking}
          >
            <Mic className={isListening ? "text-primary animate-pulse" : ""} />
          </Button>
        </div>
      </form>
    </div>
  );
}