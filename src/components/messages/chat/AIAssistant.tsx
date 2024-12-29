import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatConversation } from "./ChatConversation";
import { useChat } from "@/hooks/useChat";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface AIAssistantProps {
  onBack?: () => void;
}

export function AIAssistant({ onBack }: AIAssistantProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { toast } = useToast();
  
  const {
    messages: assistantMessages,
    inputMessage,
    isThinking,
    setInputMessage,
    handleSendMessage,
    handleVoiceInput,
    isListening,
    clearChat
  } = useChat();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        setIsConnecting(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          setCurrentUser(profile);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Impossible de récupérer vos informations. Veuillez réessayer.",
        });
      } finally {
        setIsConnecting(false);
      }
    };
    getCurrentUser();
  }, [toast]);

  const formattedMessages = assistantMessages.map(msg => ({
    id: msg.id,
    content: msg.content,
    sender: {
      id: msg.sender === 'assistant' ? 'assistant' : currentUser?.id,
      full_name: msg.sender === 'assistant' ? 'Mr Victaure' : currentUser?.full_name || 'Vous',
      avatar_url: msg.sender === 'assistant' ? '/bot-avatar.png' : currentUser?.avatar_url
    },
    created_at: msg.timestamp.toISOString(),
    read: true
  }));

  const messagesByDate = formattedMessages.reduce((groups, message) => {
    const date = new Date(message.created_at);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(message);
    return groups;
  }, {} as Record<string, typeof formattedMessages>);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full relative"
    >
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute top-2 left-2 z-10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      )}

      <ChatHeader 
        isThinking={isThinking} 
        onClearChat={clearChat}
        isConnecting={isConnecting}
      />

      <AnimatePresence mode="wait">
        {isConnecting ? (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Connexion en cours...</p>
            </div>
          </motion.div>
        ) : (
          <ChatConversation 
            messagesByDate={messagesByDate}
            currentUser={currentUser}
            isThinking={isThinking}
          />
        )}
      </AnimatePresence>

      <div className="p-4 border-t bg-background">
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          onVoiceInput={handleVoiceInput}
          isListening={isListening}
          isThinking={isThinking}
          disabled={isConnecting}
        />
      </div>
    </motion.div>
  );
}