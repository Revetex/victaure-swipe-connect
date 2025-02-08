
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { AIAssistantInput } from "./ai/AIAssistantInput";
import { AIAssistantStatus } from "./ai/AIAssistantStatus";
import { AIMessageList } from "./ai/AIMessageList";
import { aiAgentService } from "@/services/aiAgentService";

export interface AIAssistantProps {
  onClose: () => void;
  conversations?: any[];
}

function AIAssistant({ onClose, conversations = [] }: AIAssistantProps) {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: { message: input }
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await aiAgentService.handleMessage(input);
      
      const assistantMessage = {
        type: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    // Add any scroll handling logic here if needed
  };

  return (
    <Card className="fixed inset-0 z-[99999] flex flex-col bg-background/95 backdrop-blur-sm">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b safe-top">
        <div className="p-3 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold">AI Assistant</h2>
        </div>
      </div>

      {/* Messages area - Scrollable */}
      <ScrollArea 
        className="flex-1 px-3 sm:px-4"
        style={{
          height: isMobile ? 'calc(100vh - 8rem)' : 'auto',
          touchAction: 'pan-y'
        }}
      >
        <div className="py-3 sm:py-4 space-y-3 sm:space-y-4">
          <AIMessageList 
            messages={messages}
            onScroll={handleScroll}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </ScrollArea>

      {/* Status indicator */}
      <AnimatePresence>
        {isLoading && (
          <AIAssistantStatus isThinking={true} />
        )}
      </AnimatePresence>

      {/* Input area - Fixed */}
      <div className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t safe-bottom">
        <AIAssistantInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </Card>
  );
}

export default AIAssistant;
