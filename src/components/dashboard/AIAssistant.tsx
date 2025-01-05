import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AIAssistantHeader } from "./ai/AIAssistantHeader";
import { AIAssistantStatus } from "./ai/AIAssistantStatus";
import { AIAssistantInput } from "./ai/AIAssistantInput";
import { AIMessageList } from "./ai/AIMessageList";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantProps {
  onClose: () => void;
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: string; content: any }>>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const createNotification = async (message: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('notifications').insert({
        user_id: user.id,
        title: "Nouvelle réponse de M. Victaure",
        message: message.substring(0, 200) + (message.length > 200 ? '...' : ''),
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleAction = (action: string, data?: any) => {
    switch (action) {
      case 'navigate_to_jobs':
        navigate('/jobs');
        break;
      case 'navigate_to_profile':
        navigate('/profile');
        break;
      case 'create_job':
        navigate('/jobs/create');
        break;
      default:
        console.log('Action non reconnue:', action);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setIsThinking(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser l'assistant");
        return;
      }

      setMessages(prev => [...prev, { type: 'user', content: input }]);
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setIsTyping(true);
      
      const { data, error } = await supabase.functions.invoke('ai-job-assistant', {
        body: { 
          message: input,
          userId: user.id,
          context: {
            previousMessages: messages.slice(-5),
            userProfile: profile,
          }
        }
      });

      if (error) throw error;

      // Create notification for AI response
      await createNotification(data.message);

      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: {
          ...data,
          suggestedActions: data.suggestedActions || []
        }
      }]);

      if (data.suggestedActions?.length > 0) {
        data.suggestedActions.forEach((action: any) => {
          handleAction(action.type, action.data);
        });
      }

      setInput("");
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue lors de la communication avec l'assistant");
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 lg:p-8"
    >
      <Card className="max-w-2xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-gray-200 dark:border-gray-800">
        <AIAssistantHeader onClose={onClose} />

        <AIMessageList 
          messages={messages}
          onScroll={handleScroll}
          messagesEndRef={messagesEndRef}
        />

        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-24 right-4"
            >
              <Button
                size="icon"
                className="rounded-full shadow-lg"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AIAssistantStatus 
          isThinking={isThinking}
          isTyping={isTyping}
          isListening={false}
        />

        <AIAssistantInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </Card>
    </motion.div>
  );
}