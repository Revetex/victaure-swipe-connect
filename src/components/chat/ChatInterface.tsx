
import React, { useState, useCallback } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { VoiceInterface } from '../VoiceInterface';
import { useAIChat } from '@/hooks/useAIChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

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

  const handleVoiceMessage = useCallback((message: string) => {
    if (message.trim()) {
      void handleSendMessage(message);
    }
  }, [handleSendMessage]);

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
  }, []);

  // Modifier la signature pour correspondre exactement au type attendu
  const handleReply = useCallback((content: string) => {
    if (content) {
      // Utiliser void pour ignorer la promesse retournée par handleSendMessage
      void handleSendMessage(content);
    }
  }, [handleSendMessage]);

  return (
    <div className="flex flex-col h-full relative">
      <ScrollArea className="flex-1 p-4">
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
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto relative">
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={() => void handleSendMessage(inputMessage)}
            isThinking={isThinking || isSpeaking}
            disabled={isSpeaking}
            placeholder={isSpeaking ? "Synthèse vocale en cours..." : "Écrivez votre message..."}
          />
          
          <VoiceInterface
            onMessageReceived={handleVoiceMessage}
            onSpeakingChange={handleSpeakingChange}
            className="absolute right-2 bottom-16"
          />
        </div>
      </div>
    </div>
  );
}
