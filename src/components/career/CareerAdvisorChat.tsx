import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
}

export function CareerAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      
      // Add user message to chat
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: newMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser cette fonctionnalité");
        return;
      }

      // Send message to AI advisor
      const { data, error } = await supabase.functions.invoke('career-advisor', {
        body: { message: newMessage, userId: user.id }
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
    <div className="flex flex-col h-[500px] bg-gray-900/50 rounded-lg backdrop-blur-sm border border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Mr Victaure - Conseiller en Orientation</h2>
        <p className="text-sm text-gray-400">Je suis là pour vous aider à améliorer votre profil professionnel</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <AnimatePresence mode="popLayout">
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
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Posez vos questions à Mr Victaure..."
            className="flex-1 bg-gray-800/50 border-gray-700 text-white"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}