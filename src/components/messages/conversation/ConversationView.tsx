
import { Message, Receiver } from "@/types/messages"; 
import { ChatInput } from "@/components/chat/ChatInput";
import { useCallback, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ConversationHeader } from "./components/ConversationHeader";
import { ConversationMessages } from "./components/ConversationMessages";

export interface ConversationViewProps {
  messages: Message[];
  receiver: Receiver | null;
  inputMessage: string;
  isThinking?: boolean;
  isListening?: boolean;
  onInputChange: (message: string) => void;
  onSendMessage: () => void;
  onVoiceInput?: () => void;
  onBack: () => void;
  onDeleteConversation: () => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ConversationView({
  messages,
  receiver,
  inputMessage,
  isThinking,
  isListening,
  onInputChange,
  onSendMessage,
  onVoiceInput,
  onBack,
  onDeleteConversation,
  messagesEndRef
}: ConversationViewProps) {
  const { profile } = useProfile();

  const handleReply = useCallback(async (content: string) => {
    onInputChange(content);
    setTimeout(() => {
      onSendMessage();
    }, 100);
  }, [onInputChange, onSendMessage]);

  useEffect(() => {
    const saveConversation = async () => {
      if (!profile || !receiver || messages.length === 0) return;
      if (receiver.id === 'assistant') return;
      
      try {
        const { error } = await supabase
          .from('conversations')
          .upsert({
            participant1_id: profile.id,
            participant2_id: receiver.id,
            last_message: messages[messages.length - 1].content,
            last_message_time: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la conversation:", error);
      }
    };

    saveConversation();
  }, [messages, profile, receiver]);

  if (!receiver) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] fixed inset-0 top-16">
      <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ConversationHeader 
          receiver={receiver}
          onBack={onBack}
          onDelete={onDeleteConversation}
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <ConversationMessages
          messages={messages}
          isThinking={isThinking}
          onReply={handleReply}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <div className="flex-none p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            value={inputMessage}
            onChange={onInputChange}
            onSend={onSendMessage}
            isThinking={isThinking}
            isListening={isListening}
            onVoiceInput={onVoiceInput}
            onFileAttach={async (file: File, messageId: string) => {
              try {
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: JSON.stringify({ file, messageId }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                if (!response.ok) throw new Error('Upload failed');
              } catch (error) {
                console.error('Upload error:', error);
                toast.error("Erreur lors de l'upload du fichier");
              }
            }}
            placeholder="Écrivez votre message..."
          />
        </div>
      </div>
    </div>
  );
}
