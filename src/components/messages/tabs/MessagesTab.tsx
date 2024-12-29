import { MessageSquare } from "lucide-react";
import { MessageList } from "../MessageList";
import { useMessages } from "@/hooks/useMessages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useProfile } from "@/hooks/useProfile";

export function MessagesTab() {
  const { messages: userMessages, isLoading, markAsRead } = useMessages();
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
  
  return (
    <div className="space-y-4">
      {/* Assistant Chat Section - Pinned */}
      <div className="bg-background/50 rounded-lg p-4 border border-border/50 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-victaure-blue" />
          <h3 className="font-medium text-victaure-blue">Mr. Victaure - Assistant IA</h3>
        </div>
        
        <div className="max-h-[200px] overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-victaure-blue/20 scrollbar-track-transparent">
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

        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={() => handleSendMessage(inputMessage, profile)}
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
        />
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