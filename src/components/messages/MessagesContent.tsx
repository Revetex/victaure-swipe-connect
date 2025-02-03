import { Message, Receiver } from "@/types/messages";
import { ConversationView } from "./conversation/ConversationView";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

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

      // If it's the AI assistant, use the ai_chat_messages table
      if (receiver.id === 'assistant') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
          .from('ai_chat_messages')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // For regular users, use the messages table
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
          .from('messages')
          .delete()
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (error) throw error;
      }

      onBack();
      navigate('/dashboard/messages');
      toast.success("Conversation supprimée avec succès");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  // Convert Receiver to UserProfile format
  const profileFromReceiver: UserProfile | null = receiver ? {
    id: receiver.id,
    email: '',
    full_name: receiver.full_name || '',
    avatar_url: receiver.avatar_url || null,
    role: 'professional',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: 'Canada',
    skills: null,
    latitude: null,
    longitude: null,
    online_status: receiver.online_status || false,
    last_seen: receiver.last_seen || new Date().toISOString()
  } : null;

  return (
    <ConversationView
      messages={messages}
      profile={profileFromReceiver}
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