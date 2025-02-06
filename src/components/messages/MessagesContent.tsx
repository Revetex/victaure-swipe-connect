import { Message, Receiver } from "@/types/messages";
import { ConversationView } from "./conversation/ConversationView";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";
import { useEffect } from "react";

interface MessagesContentProps {
  messages: Message[];
  inputMessage: string;
  isThinking?: boolean;
  isListening?: boolean;
  onSendMessage: (message: string) => void;
  onVoiceInput?: () => void;
  setInputMessage: (message: string) => void;
  onClearChat: () => void;
  onBack?: () => void;
  receiver: Receiver | null;
}

export function MessagesContent({
  messages,
  inputMessage,
  isThinking,
  isListening,
  onSendMessage,
  onVoiceInput,
  setInputMessage,
  onClearChat,
  onBack,
  receiver
}: MessagesContentProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!receiver) return;

    // Subscribe to real-time updates for new messages
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${receiver.id}`
        },
        () => {
          console.log('New message received');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [receiver]);

  const handleDelete = async () => {
    try {
      if (!receiver) return;

      if (receiver.id === 'assistant') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
          .from('ai_chat_messages')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
          .from('messages')
          .delete()
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (error) throw error;
      }

      onBack?.();
      navigate('/dashboard/messages');
      toast.success("Conversation supprimée avec succès");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

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
    <div className="flex flex-col h-full">
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
        onDeleteConversation={handleDelete}
      />
    </div>
  );
}