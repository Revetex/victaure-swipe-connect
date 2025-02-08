
import { useState, useEffect, useRef } from "react";
import { AIAssistant } from "./dashboard/AIAssistant";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export function Chat() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleStartChat = () => {
    setShowWelcome(false);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setShowWelcome(true);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participant1:participant1_id(full_name, avatar_url),
            participant2:participant2_id(full_name, avatar_url)
          `)
          .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
          .is('is_deleted', false)
          .order('last_message_time', { ascending: false });

        if (error) throw error;
        setConversations(data || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Error",
          description: "Could not load conversations",
          variant: "destructive"
        });
      }
    };

    fetchConversations();
  }, [toast]);

  return (
    <AnimatePresence>
      {(showWelcome || showChat) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm isolate"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999
          }}
        >
          <div className="h-full w-full flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {showWelcome && (
                <MrVictaureWelcome 
                  onDismiss={() => setShowWelcome(false)}
                  onStartChat={handleStartChat}
                />
              )}
              
              {showChat && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full h-full max-w-4xl mx-auto pb-8 relative"
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                >
                  <AIAssistant 
                    onClose={handleCloseChat}
                    conversations={conversations}
                  />
                  
                  {showScrollButton && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute bottom-4 right-4"
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
                        onClick={scrollToBottom}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
