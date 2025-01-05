import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Bot } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "./types";
import { ChatHeader } from "./ChatHeader";
import { QuickSuggestions } from "./QuickSuggestions";
import { ChatInput } from "./ChatInput";

export function CareerAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setShowSuggestions(false);
      
      // Add user message to chat
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: messageContent,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser cette fonctionnalité");
        return;
      }

      // Send message to AI advisor
      const { data, error } = await supabase.functions.invoke('career-advisor', {
        body: { message: messageContent, userId: user.id }
      });

      if (error) throw error;

      // Add advisor response to chat
      const advisorMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        sender: 'advisor',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, advisorMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900/50 rounded-lg backdrop-blur-sm border border-gray-800">
      <ChatHeader isLoading={isLoading} />

      <ScrollArea className="flex-1 p-4">
        <AnimatePresence mode="popLayout">
          {showSuggestions && messages.length === 0 && (
            <QuickSuggestions onSelect={sendMessage} />
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 ${
                message.sender === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white ml-auto'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-gray-400 mb-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <Bot className="h-5 w-5" />
              </motion.div>
              <span className="text-sm">M. Victaure réfléchit</span>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      <ChatInput isLoading={isLoading} onSendMessage={sendMessage} />
    </div>
  );
}