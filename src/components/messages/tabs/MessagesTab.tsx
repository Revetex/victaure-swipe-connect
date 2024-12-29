import { MessageSquare, Bot } from "lucide-react";
import { MessageList } from "../MessageList";
import { useMessages } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
  const [showAssistant, setShowAssistant] = useState(true);
  const {
    messages: assistantMessages,
    inputMessage,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    isListening,
  } = useChat();
  
  return (
    <div className="space-y-4">
      {/* Assistant Section */}
      <div className={`transition-all duration-300 ${showAssistant ? 'mb-4' : 'h-0 overflow-hidden'}`}>
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Assistant IA</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAssistant(!showAssistant)}
            >
              {showAssistant ? "Masquer" : "Afficher"}
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="h-[200px] overflow-y-auto space-y-4">
              {assistantMessages.map((message, index) => (
                <ChatMessage
                  key={index}
                  content={message.content}
                  sender={message.sender}
                  thinking={message.thinking}
                />
              ))}
            </div>
            
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
      </div>

      {/* User Messages Section */}
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
    </div>
  );
}