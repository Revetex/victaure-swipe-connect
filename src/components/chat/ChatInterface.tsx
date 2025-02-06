
import { useState, useRef, useEffect } from "react";
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

export function ChatInterface() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();

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

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('ai_chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages(data || []);
        scrollToBottom();
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error("Erreur lors du chargement des messages");
      }
    };

    loadMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking) return;

    try {
      setIsThinking(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser le chat");
        return;
      }

      // Save user message
      const userMessage = {
        id: crypto.randomUUID(),
        content: input,
        sender: 'user',
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      await supabase
        .from('ai_chat_messages')
        .insert(userMessage);

      setMessages(prev => [...prev, userMessage]);
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
      const aiMessage = {
        id: crypto.randomUUID(),
        content: data.response,
        sender: 'assistant',
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      await supabase
        .from('ai_chat_messages')
        .insert(aiMessage);

      setMessages(prev => [...prev, aiMessage]);
      scrollToBottom();

    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-6rem)] mx-auto max-w-2xl bg-background/95 backdrop-blur-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chat avec M. Victaure</h2>
        <p className="text-sm text-muted-foreground">
          Votre assistant personnel
        </p>
      </div>

      <ScrollArea 
        className="flex-1 p-4"
        onScrollCapture={handleScroll}
      >
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
              className="rounded-full shadow-lg"
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
