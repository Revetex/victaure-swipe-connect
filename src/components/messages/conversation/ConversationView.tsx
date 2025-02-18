import { Message, Receiver } from "@/types/messages"; 
import { ChatInput } from "@/components/chat/ChatInput";
import { useCallback, useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ConversationHeader } from "./components/ConversationHeader";
import { ConversationMessages } from "./components/ConversationMessages";
import { VoiceChatActivator } from "./components/VoiceChatActivator";

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
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
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
      
      // Ne pas sauvegarder les conversations avec l'assistant
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

        if (error) {
          console.error("Erreur lors de la sauvegarde de la conversation:", error);
          throw error;
        }
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la conversation:", error);
      }
    };

    saveConversation();
  }, [messages, profile, receiver]);

  if (!receiver) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      <ConversationHeader 
        receiver={receiver}
        onBack={onBack}
        onDelete={onDeleteConversation}
      />

      <ConversationMessages
        messages={messages}
        isThinking={isThinking}
        onReply={handleReply}
        messagesEndRef={messagesEndRef}
      />

      <footer className="flex-none p-4 bg-background border-t">
        <div className="max-w-2xl mx-auto">
          <VoiceChatActivator 
            isActive={isVoiceChatActive}
            onActivate={() => {
              setIsVoiceChatActive(true);
              if (onVoiceInput) onVoiceInput();
            }}
          />
          <ChatInput
            value={inputMessage}
            onChange={onInputChange}
            onSend={onSendMessage}
            isThinking={isThinking}
            isListening={isListening}
            onVoiceInput={onVoiceInput}
            onFileAttach={(file) => {
              toast.success(`Fichier ${file.name} attaché`);
              // Implement file handling logic here
            }}
            placeholder="Écrivez votre message..."
          />
        </div>
      </footer>
    </div>
  );
}
