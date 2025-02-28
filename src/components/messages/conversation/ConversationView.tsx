
import { useReceiver } from "@/hooks/useReceiver";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ConversationHeader } from "./components/ConversationHeader";
import { MessageList } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { useMessages } from "./hooks/useMessages";
import type { Receiver, UserRole } from "@/types/messages";

export function ConversationView() {
  const { receiver, setReceiver, setShowConversation } = useReceiver();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, handleDeleteMessage, setMessages } = useMessages(receiver);
  
  useEffect(() => {
    const receiverId = searchParams.get('receiver');
    if (receiverId && !receiver) {
      loadUserProfile(receiverId);
    }
  }, [searchParams]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          certifications (*),
          education (*),
          experiences (*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (profile) {
        // Vérifions que le rôle est valide
        const validRoles: UserRole[] = ['professional', 'business', 'admin'];
        const userRole: UserRole = validRoles.includes(profile.role as UserRole) 
          ? (profile.role as UserRole)
          : 'professional';

        setReceiver({
          id: profile.id,
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url,
          email: profile.email,
          role: userRole,
          bio: profile.bio,
          phone: profile.phone,
          city: profile.city,
          state: profile.state,
          country: profile.country || '',
          skills: profile.skills || [],
          latitude: profile.latitude,
          longitude: profile.longitude,
          online_status: profile.online_status ? 'online' : 'offline',
          last_seen: profile.last_seen,
          certifications: profile.certifications || [],
          education: profile.education || [],
          experiences: profile.experiences || [],
          friends: []
        });
        setShowConversation(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Impossible de charger le profil");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBack = () => {
    setShowConversation(false);
    navigate('/messages');
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !receiver) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: messageInput,
          sender_id: user.id,
          receiver_id: receiver.id,
          metadata: JSON.stringify({}),
        });

      if (error) throw error;
      
      setMessageInput("");
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Impossible d'envoyer le message");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1F2C]">
      <ConversationHeader 
        receiver={receiver}
        onBack={handleBack}
      />
      
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          currentUserId={user?.id}
          onDeleteMessage={handleDeleteMessage}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <div className="w-full">
        <MessageInput
          value={messageInput}
          onChange={setMessageInput}
          onSubmit={handleSendMessage}
        />
      </div>
    </div>
  );
}
