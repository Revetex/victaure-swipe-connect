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
  const handleClearChat = async (messageId?: string) => {
    try {
      if (messageId) {
        // Delete specific conversation
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', messageId);

        if (error) throw error;
      } else if (onClearChat) {
        // Clear AI chat
        onClearChat();
      }
      toast.success("Conversation effacée avec succès");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Erreur lors de l'effacement de la conversation");
    }
  };

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
        
        {messages.map((message) => (
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
                handleClearChat(message.id);
              }}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {messages?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>Aucune conversation pour le moment</p>
            <p className="text-sm">Commencez une nouvelle conversation!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}