import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  "Comment améliorer mon CV ?",
  "Quelles sont les compétences recherchées dans mon domaine ?",
  "Conseils pour l'entretien d'embauche",
  "Comment négocier mon salaire ?"
];

export function CareerAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const sendMessage = async (e: React.FormEvent | string) => {
    if (e?.preventDefault) e.preventDefault();
    
    const messageContent = typeof e === 'string' ? e : newMessage;
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
      setNewMessage("");

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
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={isLoading ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center ring-2 ring-indigo-600/40">
                <Bot className="h-5 w-5 text-indigo-400" />
              </div>
            </motion.div>
            {isLoading && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-gray-900" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              M. Victaure
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </h2>
            <p className="text-sm text-gray-400">
              {isLoading ? "En train de réfléchir..." : "Conseiller en Orientation"}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <AnimatePresence mode="popLayout">
          {showSuggestions && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-2 mb-4"
            >
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  className="text-sm text-gray-300 border-gray-700 hover:bg-gray-800/50"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </motion.div>
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

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Posez vos questions à M. Victaure..."
            className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !newMessage.trim()}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white transition-all ${
              newMessage.trim() && !isLoading ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}