
import { Message, Receiver } from "@/types/messages";
import { ConversationView } from "./conversation/ConversationView";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface MessagesContentProps {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!receiver) return;

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
        (payload) => {
          console.log('New message received:', payload);
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [receiver]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleDelete = async () => {
    try {
      if (!receiver) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (error) throw error;

      onClearChat();
      onBack?.();
      navigate('/dashboard/messages');
      toast.success("Conversation supprimée avec succès");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Erreur lors de la suppression de la conversation");
    }
  };

  if (!receiver) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm">
      <div 
        className="h-full flex flex-col"
        style={{ 
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="conversation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 relative"
          >
            <ConversationView
              receiver={receiver}
              messages={messages}
              inputMessage={inputMessage}
              isListening={isListening}
              isThinking={isThinking}
              onInputChange={setInputMessage}
              onSendMessage={() => onSendMessage(inputMessage)}
              onVoiceInput={onVoiceInput}
              onBack={onBack || (() => {})}
              onDeleteConversation={handleDelete}
              messagesEndRef={messagesEndRef}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

