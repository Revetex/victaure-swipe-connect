
import { useReceiver } from "@/hooks/useReceiver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef } from "react";
import { Message } from "@/types/messages";
import { ChatMessage } from "../ChatMessage";

export function ConversationView() {
  const { receiver, setShowConversation } = useReceiver();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleBack = () => {
    setShowConversation(false);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // Logique d'envoi du message
    setMessageInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        {receiver && (
          <div className="flex items-center gap-3">
            <UserAvatar
              user={{
                ...receiver,
                online_status: receiver.online_status === 'online',
                friends: []
              }}
              className="h-10 w-10"
            />
            <div>
              <p className="font-medium">{receiver.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {receiver.online_status === 'online' ? 'En ligne' : 'Hors ligne'}
              </p>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Les messages seront mappés ici */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            placeholder="Écrire un message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
