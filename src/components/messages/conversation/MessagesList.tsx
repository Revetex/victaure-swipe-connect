import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchHeader } from "../conversation/SearchHeader";
import { UserMessage } from "../conversation/UserMessage";
import { useState } from "react";
import { Message } from "@/types/chat/messageTypes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
            sender_id: (await supabase.auth.getUser()).data.user?.id,
            receiver_id: friendId,
            content: "👋 Bonjour!",
            read: false
          })
          .select()
          .single();

        if (insertError) throw insertError;
      }

      // Navigate to conversation
      navigate(`/dashboard/messages/${friendId}`);
      toast.success("Conversation créée avec succès");
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Erreur lors de la création de la conversation");
    }
  };

  const filteredMessages = messages.filter((message) =>
    message.sender.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((message) => !message.read).length;

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
          {filteredMessages.map((message) => (
            <UserMessage
              key={message.id}
              message={message}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}