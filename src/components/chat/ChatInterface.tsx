
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { AIAssistantStatus } from "../dashboard/ai/AIAssistantStatus";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRealtimeChat } from "@/hooks/chat/useRealtimeChat";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const { messages, addMessage } = useRealtimeChat();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = (event: any) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom = 
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    try {
      setIsThinking(true);
      
      // Save user message
      const userMessage = await addMessage(input, 'user');
      if (!userMessage) return;

      setInput("");
      scrollToBottom();

      // Get AI response
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: input,
          context: {
            previousMessages: messages.slice(-5),
            userProfile: profile
          }
        }
      });

      if (error) throw error;

      // Save AI response
      await addMessage(data.response, 'assistant');
      scrollToBottom();

    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-6rem)] mx-auto max-w-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <motion.div 
        initial={false}
        animate={{ 
          borderColor: isThinking ? "hsl(var(--primary))" : "transparent" 
        }}
        className="p-4 border-b transition-colors duration-200"
      >
        <h2 className="text-xl font-semibold">Chat avec M. Victaure</h2>
        <p className="text-sm text-muted-foreground">
          Votre assistant personnel
        </p>
      </motion.div>

      <ScrollArea 
        className="flex-1 p-4"
        onScrollCapture={handleScroll}
      >
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ChatMessage
                  content={message.content}
                  sender={message.sender}
                  timestamp={message.created_at}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isThinking && <AIAssistantStatus isThinking={true} />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 right-4"
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={scrollToBottom}
              className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 border-t">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          isThinking={isThinking}
          placeholder="Posez vos questions à M. Victaure..."
        />
      </div>
    </Card>
  );
}
