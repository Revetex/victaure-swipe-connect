import { Message, Receiver } from "@/types/messages";
import { ConversationView } from "./conversation/ConversationView";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MessagesContentProps {
  messages: Message[];
  inputMessage: string;
  isListening: boolean;
  isThinking: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onVoiceInput: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onBack: () => void;
  receiver: Receiver | null;
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
  onBack,
  receiver
}: MessagesContentProps) {
  const navigate = useNavigate();

  const handleDeleteConversation = async () => {
    try {
      if (!receiver) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Delete all messages in the conversation
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${user.id})`);

      if (error) throw error;

      onBack();
      navigate('/dashboard/messages');
      toast.success("Conversation supprimée avec succès");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  return (
    <ConversationView
      messages={messages}
      profile={receiver}
      inputMessage={inputMessage}
      isListening={isListening}
      isThinking={isThinking}
      onInputChange={setInputMessage}
      onSendMessage={onSendMessage}
      onVoiceInput={onVoiceInput}
      onBack={onBack}
      onDeleteConversation={handleDeleteConversation}
    />
  );
}