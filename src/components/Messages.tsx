import { useChat } from "@/hooks/useChat";
import { MessagesContent } from "./messages/MessagesContent";
import { useState } from "react";
import { MessagesList } from "./messages/conversation/MessagesList";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "sonner";
import { ProfilePreview } from "./ProfilePreview";
import { UserProfile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Messages() {
  const {
    messages: chatMessages,
    inputMessage,
    isListening,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    clearChat
  } = useChat();

  const { messages, markAsRead } = useMessages();
  const [showConversation, setShowConversation] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile", selectedProfile?.id],
    queryFn: async () => {
      if (!selectedProfile?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", selectedProfile.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data as UserProfile;
    },
    enabled: !!selectedProfile?.id
  });

  const handleBack = () => {
    setShowConversation(false);
    setSelectedProfile(null);
  };

  const handleSelectConversation = async (type: "assistant", profile?: UserProfile) => {
    try {
      if (profile) {
        setSelectedProfile(profile);
      }
      setShowConversation(true);
    } catch (error) {
      console.error("Error selecting conversation:", error);
      toast.error("Erreur lors de la sélection de la conversation");
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead.mutate(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Erreur lors du marquage du message comme lu");
    }
  };

  const handleSendMessageWithFeedback = async (message: string) => {
    if (!message.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }

    try {
      await handleSendMessage(message);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };

  return (
    <div className="h-full flex flex-col">
      {showConversation ? (
        <MessagesContent
          messages={chatMessages}
          inputMessage={inputMessage}
          isListening={isListening}
          isThinking={isThinking}
          onSendMessage={handleSendMessageWithFeedback}
          onVoiceInput={handleVoiceInput}
          setInputMessage={setInputMessage}
          onClearChat={clearChat}
          onBack={handleBack}
        />
      ) : (
        <>
          <MessagesList
            messages={messages}
            chatMessages={chatMessages}
            onSelectConversation={handleSelectConversation}
            onMarkAsRead={handleMarkAsRead}
          />
          {selectedProfile && (
            <ProfilePreview 
              profile={selectedProfile} 
              onClose={handleCloseProfile}
            />
          )}
        </>
      )}
    </div>
  );
}