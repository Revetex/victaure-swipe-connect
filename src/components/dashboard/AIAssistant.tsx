
import { useState, useRef, useCallback } from "react";
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
import { useProfile } from "@/hooks/useProfile";

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
  const { profile } = useProfile();

  const handleAction = useCallback((action: string, data?: any) => {
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
  }, [navigate]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, []);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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

      // Add user message to the conversation
      const userMessage = { type: 'user', content: { message: input } };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      // Call AI assistant function
      const { data, error } = await supabase.functions.invoke('ai-career-assistant', {
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

      // Store the interaction in ai_learning_data
      const serializedContext = {
        profile: profile ? JSON.parse(JSON.stringify(profile)) : null,
        previousMessages: messages.slice(-5).map(m => ({
          type: m.type,
          content: m.content
        }))
      };

      await supabase.from('ai_learning_data').insert({
        user_id: user.id,
        question: input,
        response: data.message,
        context: serializedContext
      });

      // Add AI response to the conversation
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: {
          message: data.message,
          suggestedJobs: data.suggestedJobs || []
        }
      }]);

      setInput("");
      scrollToBottom();
      
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue lors de la communication avec l'assistant");
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setIsTyping(false);
    }
  }, [input, isLoading, messages, profile, scrollToBottom]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 lg:p-8"
    >
      <Card className="max-w-2xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-lg">
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
                className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
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
