import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHeader } from "../conversation/SearchHeader";
import { UserMessage } from "../conversation/UserMessage";
import { useState } from "react";
import { Message } from "@/types/chat/messageTypes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AssistantMessage } from "./AssistantMessage";

interface MessagesListProps {
  messages: any[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant") => void;
  onMarkAsRead: (messageId: string) => void;
}

export function MessagesList({
  messages,
  chatMessages,
  onSelectConversation,
  onMarkAsRead,
}: MessagesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleNewConversation = () => {
    onSelectConversation("assistant");
  };

  const handleSelectFriend = async (friendId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if conversation already exists
      const { data: existingMessages, error: checkError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${friendId},receiver_id.eq.${friendId}`)
        .limit(1);

      if (checkError) throw checkError;

      if (!existingMessages || existingMessages.length === 0) {
        // Create initial message to start conversation
        const { data: message, error: insertError } = await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: friendId,
            content: "👋 Bonjour!",
            read: false
          })
          .select()
          .single();

        if (insertError) throw insertError;
      }

      navigate(`/dashboard/messages/${friendId}`);
      toast.success("Conversation créée avec succès");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Erreur lors de la création de la conversation");
    }
  };

  // Filter messages based on search query
  const filteredMessages = messages?.filter((message) =>
    message?.sender?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  console.log("Messages disponibles:", messages); // For debugging
  const unreadCount = messages?.filter((message) => !message.read).length || 0;

  const handleAcceptMessage = async (message: any) => {
    try {
      // Mark message as read
      await onMarkAsRead(message.id);
      
      // Navigate to the conversation with the sender
      navigate(`/dashboard/messages/${message.sender_id}`);
      
      toast.success("Message accepté");
    } catch (error) {
      console.error("Error accepting message:", error);
      toast.error("Erreur lors de l'acceptation du message");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <SearchHeader 
        unreadCount={unreadCount}
        onSearch={handleSearch}
        onNewConversation={handleNewConversation}
        onSelectFriend={handleSelectFriend}
      />
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Mr. Victaure's conversation always pinned at the top */}
          <AssistantMessage
            chatMessages={chatMessages}
            onSelectConversation={onSelectConversation}
          />
          
          {/* Other conversations */}
          {filteredMessages.map((message) => (
            <UserMessage
              key={message.id}
              message={message}
              onMarkAsRead={() => handleAcceptMessage(message)}
            />
          ))}

          {/* Show empty state when no messages */}
          {messages?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <p>Aucune conversation pour le moment</p>
              <p className="text-sm">Commencez une nouvelle conversation!</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}