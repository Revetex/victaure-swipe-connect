import { Message } from "@/types/messages";
import { UserMessage } from "./UserMessage";
import { AssistantMessage } from "./AssistantMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ConversationListProps {
  messages: Message[];
  chatMessages: Message[];
  onSelectConversation: (type: "assistant" | "user", receiver?: any) => void;
  onClearChat?: () => void;
}

export function ConversationList({
  messages,
  chatMessages,
  onSelectConversation,
  onClearChat
}: ConversationListProps) {
  const handleClearChat = async (messageId?: string, senderId?: string, receiverId?: string) => {
    try {
      if (messageId) {
        if (senderId && receiverId && senderId === receiverId) {
          // Delete all messages between user and themselves
          const { error } = await supabase
            .from('messages')
            .delete()
            .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`);

          if (error) throw error;
        } else {
          // Delete specific conversation
          const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);

          if (error) throw error;
        }
        toast.success("Conversation effacée avec succès");
      } else if (onClearChat) {
        // Clear AI chat
        onClearChat();
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

  // Filter out self-conversations after deletion
  const filteredMessages = messages.filter(message => 
    message.sender_id !== message.receiver_id
  );

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        <div className="group relative">
          <div 
            onClick={() => onSelectConversation("assistant")}
            className="cursor-pointer"
          >
            <AssistantMessage
              chatMessages={chatMessages}
              onSelectConversation={onSelectConversation}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleClearChat();
            }}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {filteredMessages.map((message) => (
          <div 
            key={message.id}
            className="group relative"
          >
            <div
              onClick={() => onSelectConversation("user", message.sender)}
              className="cursor-pointer"
            >
              <UserMessage message={message} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleClearChat(message.id, message.sender_id, message.receiver_id);
              }}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>Aucune conversation pour le moment</p>
            <p className="text-sm">Commencez une nouvelle conversation!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}