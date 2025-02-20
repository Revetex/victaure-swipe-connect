
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { VoiceInterface } from '@/components/VoiceInterface';
import { useAIChat } from '@/hooks/useAIChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Bot } from 'lucide-react';

export function ChatInterface() {
  const {
    messages,
    isThinking,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    handleJobAccept,
    handleJobReject
  } = useAIChat();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceMessage = useCallback((message: string) => {
    if (message.trim()) {
      void handleSendMessage(message);
    }
  }, [handleSendMessage]);

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
  }, []);

  const handleReply = useCallback((content: string) => {
    if (content) {
      void handleSendMessage(content);
    }
  }, [handleSendMessage]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Bot className="w-6 h-6 text-primary" />
        <h1 className="text-lg font-semibold">Assistant IA</h1>
      </div>

      {/* Messages Area with Scroll */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onReply={handleReply}
              onJobAccept={handleJobAccept}
              onJobReject={handleJobReject}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Area at Bottom */}
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto p-4 relative">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSendMessage={handleSendMessage}
            isLoading={isThinking}
            disabled={isSpeaking}
            placeholder={isSpeaking ? "Synthèse vocale en cours..." : "Écrivez votre message..."}
          />
          
          <VoiceInterface
            onMessageReceived={handleVoiceMessage}
            onSpeakingChange={handleSpeakingChange}
            className="absolute right-4 bottom-16"
          />
        </div>
      </div>
    </div>
  );
}
