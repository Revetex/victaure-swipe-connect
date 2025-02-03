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

  // Convert Receiver to UserProfile format with all required fields
  const profileFromReceiver: UserProfile | null = receiver ? {
    id: receiver.id,
    email: '',  // Required field but not needed for display
    full_name: receiver.full_name || '',
    avatar_url: receiver.avatar_url || null,
    role: 'professional',  // Default role
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: 'Canada',
    skills: null,
    latitude: null,
    longitude: null,
    online_status: receiver.online_status || false,
    last_seen: receiver.last_seen || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    company_name: null,
    company_size: null,
    industry: null,
    website: null,
    style_id: 'modern',
    custom_font: null,
    custom_background: null,
    custom_text_color: null,
    sections_order: ['header', 'bio', 'contact', 'skills', 'education', 'experience'],
    notifications_enabled: true,
    location_enabled: false,
    auto_update_enabled: true,
    two_factor_enabled: false,
    privacy_enabled: false
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