
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useReceiver } from "@/hooks/useReceiver.tsx";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Smile, Image, Paperclip } from "lucide-react";
import { Message, Sender } from "@/types/messages";
import { supabase } from "@/integrations/supabase/client";
import { ConversationHeaderAdapter } from "./ConversationHeaderAdapter";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/utils/userUtils";
import { useChatMessages } from "@/hooks/useChatMessages";

interface ConversationViewProps {
  onBack?: () => void;
}

export function ConversationView({ onBack }: ConversationViewProps) {
  const { user } = useAuth();
  const { receiver } = useReceiver();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Utiliser notre hook personnalisé
  const { messages, isLoading, sendMessage } = useChatMessages(conversationId, receiver?.id);

  // Récupérer ou créer une conversation
  useEffect(() => {
    if (!user || !receiver) return;

    const fetchOrCreateConversation = async () => {
      try {
        // Vérifier si une conversation existe déjà entre les deux utilisateurs
        let { data: conversation, error } = await supabase
          .from("conversations")
          .select("*")
          .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${receiver.id}),and(participant1_id.eq.${receiver.id},participant2_id.eq.${user.id})`)
          .single();

        if (error || !conversation) {
          // Créer une nouvelle conversation
          const { data: newConversation, error: createError } = await supabase
            .from("conversations")
            .insert([
              {
                participant1_id: user.id,
                participant2_id: receiver.id,
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          conversation = newConversation;
        }

        setConversationId(conversation.id);
      } catch (err) {
        console.error("Erreur lors de la récupération/création de la conversation:", err);
      }
    };

    fetchOrCreateConversation();
  }, [user, receiver]);

  // Faites défiler jusqu'au dernier message après le chargement ou l'ajout de nouveaux messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (await sendMessage(newMessage)) {
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {receiver && <ConversationHeaderAdapter receiver={receiver} onBack={onBack} />}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 max-w-3/4",
              message.sender_id === user?.id
                ? "ml-auto justify-end"
                : "mr-auto justify-start"
            )}
          >
            {message.sender_id !== user?.id && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.sender?.avatar_url || ""} />
                <AvatarFallback>
                  {getInitials(message.sender?.full_name || "")}
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                "rounded-lg p-3 text-sm",
                message.sender_id === user?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50"
              )}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <p className="text-xs mt-1 opacity-60 text-right">
                {format(new Date(message.created_at), "HH:mm", { locale: fr })}
              </p>
            </div>

            {message.sender_id === user?.id && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                <AvatarFallback>
                  {getInitials(user?.user_metadata?.full_name || "")}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Card className="p-4 border-t m-0 rounded-none shadow-md">
        <div className="flex items-end gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <Smile className="h-4 w-4" />
              <span className="sr-only">Ajouter emoji</span>
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Joindre fichier</span>
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full"
            >
              <Image className="h-4 w-4" />
              <span className="sr-only">Envoyer image</span>
            </Button>
            <Button
              type="button"
              variant="default"
              size="icon"
              className="rounded-full"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
